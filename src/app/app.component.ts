import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/Authservice'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      this.authService.setLoggedIn(isLoggedIn === 'true');
    }
  }
  get isLoggedIn() {
    return this.authService.isLoggedIn;
  }
      handleLogout() {
  this.authService.setLoggedIn(false);
}

}
