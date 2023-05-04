import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
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
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  handleLogin() {
    this.afAuth.signInWithEmailAndPassword(this.email, this.password)
      .then(userCredential => {
        const user = userCredential.user;
       
        this.success = 'Login successful!';
        this.router.navigate(['/home']);
      })
      .catch(error => { 
        alert(error.message); 
        this.success = error.message; 
      });
  }
}
