import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
 

  constructor() {}

  setLoggedIn(value: boolean) {
    this.isLoggedIn = value;
     localStorage.setItem('isLoggedIn', value ? 'true' : 'false');
  }
}
