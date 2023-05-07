//This typescript is to store the state of user  login
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false; // Default value of isLoggedIn is false

  constructor() {}

  // Method to set the value of isLoggedIn and store it in localStorage
  setLoggedIn(value: boolean) {
    this.isLoggedIn = value;
    localStorage.setItem('isLoggedIn', value ? 'true' : 'false'); // Store isLoggedIn as a string 'true' or 'false' in localStorage
  }
}
