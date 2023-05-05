import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import * as moment from 'moment-timezone';
//import { Pagination } from '../../components/Pagination';

interface AirportCounts {
  departure: { [airportCode: string]: number };
  arrival: { [airportCode: string]: number };
  currentTime: { [airportCode: string]: string };
}

interface Flight {
  icao24: string;
  firstSeen: number;
  lastSeen: number;
  estDepartureAirport?: string;
  estArrivalAirport?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  flights: Flight[] = [];
  airportCounts: AirportCounts = { departure: {}, arrival: {}, currentTime: {} };
  currentPage = 1;
  itemsPerPage = 10;

  ngOnInit() {
    this.fetchData();
    setInterval(() => {
      this.fetchData();
    }, 1000);
  }

  async fetchData() {
    const now = Math.floor(Date.now() / 1000); // current Unix timestamp in seconds
    const begin = now - 3600; // 1 hour ago
    const end = now + 3600; // 1 hour from now

    try {
      const res = await axios.get(`https://opensky-network.org/api/flights/all?begin=${begin}&end=${end}`);
      const flights = res.data;
      const counts = this.countAirports(flights);
      this.flights = flights;
      this.airportCounts = counts;
    } catch (err) {
      console.log(err);
    }
  }

  countAirports(flights: Flight[]) {
    const departureCounts: { [airportCode: string]: number } = {};
    const arrivalCounts: { [airportCode: string]: number } = {};
    const airportFirstSeen: { [airportCode: string]: number } = {};
    const airportLastSeen: { [airportCode: string]: number } = {};

    flights.forEach(flight => {
      const { icao24, firstSeen, lastSeen, estDepartureAirport, estArrivalAirport } = flight;

      if (estDepartureAirport) {
        departureCounts[estDepartureAirport] = departureCounts[estDepartureAirport] + 1 || 1;
        airportFirstSeen[estDepartureAirport] = Math.min(firstSeen, airportFirstSeen[estDepartureAirport] || firstSeen);
        airportLastSeen[estDepartureAirport] = Math.max(lastSeen, airportLastSeen[estDepartureAirport] || lastSeen);
      }
      if (estArrivalAirport) {
        arrivalCounts[estArrivalAirport] = arrivalCounts[estArrivalAirport] + 1 || 1;
        airportFirstSeen[estArrivalAirport] = Math.min(firstSeen, airportFirstSeen[estArrivalAirport] || firstSeen);
        airportLastSeen[estArrivalAirport] = Math.max(lastSeen, airportLastSeen[estArrivalAirport] || lastSeen);
      }
    });

    // Calculate the current time at each airport based on the average of the first and last seen times
    const airportCurrentTime: { [airportCode: string]: string } = {};
    Object.keys(airportFirstSeen).forEach(airportCode => {
      const earliestTime = airportFirstSeen[airportCode];
      const latestTime = airportLastSeen[airportCode];
      const avgTime = Math.floor((earliestTime + latestTime) / 2);
      const cstTime = moment.tz(avgTime * 1000, 'America/Chicago');
      const timeFormat = cstTime.hour() < 12 ? 'h:mm A' :'h:mm P';
      airportCurrentTime[airportCode] = cstTime.format(timeFormat)  + ' CST';
    });

    return { departure: departureCounts, arrival: arrivalCounts, currentTime: airportCurrentTime };
  }
}
