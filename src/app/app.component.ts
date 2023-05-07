// Import necessary modules and services
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/Authservice'

// Declare the component metadata
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Inject the AuthService into the component
  constructor(private authService: AuthService) {}

  // Initialize the component on load
  ngOnInit() {
    // Get the logged-in status from local storage
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      // Set the logged-in status in the AuthService based on local storage value
      this.authService.setLoggedIn(isLoggedIn === 'true');
    }
  }

  // Check if the user is logged in or not
  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }

  // Handle the user logout event
  handleLogout() {
    // Set the logged-in status in the AuthService to false
    this.authService.setLoggedIn(false);
  }
}
