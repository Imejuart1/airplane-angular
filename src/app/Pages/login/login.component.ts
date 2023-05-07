import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AuthService } from '../../services/Authservice'; // import your auth service here

//import { User } from '../models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  success: string = '';
   constructor(private router: Router, private afAuth: AngularFireAuth, private authService: AuthService) {}
  

  handleLogin() {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then(userCredential => {
        const user = userCredential.user;
         this.authService.setLoggedIn(true); // set logged-in status in your auth service
        this.success = 'Login successful!';
      })
      .catch(error => { 
        alert(error.message); 
        this.success = error.message; 
      });
  }
}
