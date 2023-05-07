import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './Authservice';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // check if user is logged in
    if (!this.authService.isLoggedIn) {
      // if not, redirect to the login page
      this.router.navigateByUrl('/login');
      return false;
    }
    // if user is logged in, allow access to the requested route
    return true;
  }
}
