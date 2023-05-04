import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  // State variables for email and password
  email = '';
  password = '';
  success = '';

  constructor(private auth: AngularFireAuth) {}

  // Function to handle sign up
  handleSignUp() {
    this.auth.createUserWithEmailAndPassword(this.email, this.password)
      .then(userCredential => {
        // User registration successful
        const user = userCredential.user;
        console.log(user);
        this.success = 'Registration successful!';
        alert('Registration successful!');
      })
      .catch(error => {
        // If there's an error during registration, show the error message
        this.success = error.message;
        alert(error.message);
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  }
}
