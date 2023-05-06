import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  flights: any[] = [];
  airportCounts: { departure: {[key: string]: number}, arrival: {[key: string]: number}, currentTime: {[key: string]: string} } = {
    departure: {},
    arrival: {},
    currentTime: {}
  };
  currentPage = 1;
  itemsPerPage = 5;
    p: number = 1;

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

  countAirports(flights: any[]) {
    const departureCounts: {[key: string]: number} = {};
    const arrivalCounts: {[key: string]: number} = {};
    const airportFirstSeen: {[key: string]: number} = {};
    const airportLastSeen: {[key: string]: number} = {};

    interface AirportCurrentTime {
      [key: string]: string;
    }
    const airportCurrentTime: AirportCurrentTime = {};

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

    Object.keys(airportFirstSeen).forEach(airportCode => {
      const earliestTime = airportFirstSeen[airportCode];
      const latestTime = airportLastSeen[airportCode];
      const avgTime = Math.floor((earliestTime + latestTime) / 2);
      const cstTime = moment.tz(avgTime * 1000, 'America/Chicago');
      const timeFormat = cstTime.hour() < 12 ? ' h:mm A' : ' h:mm P';
      airportCurrentTime[airportCode] = cstTime.format(timeFormat)  + ' CST';
    });

    return { departure: departureCounts, arrival: arrivalCounts, currentTime: airportCurrentTime };

  }
}
