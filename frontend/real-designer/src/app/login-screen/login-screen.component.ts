import { Component, Output, EventEmitter, Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatIconRegistry } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import { Http, Response } from '@angular/http';

import { DesignerService } from '../designer/designer.service';

declare var $: any;

@Component({
  selector: 'login-screen',
  templateUrl: './login-screen.component.html',
  styleUrls: ['./login-screen.component.css']
})
export class LoginScreenComponent {

  @Output() login = new EventEmitter<any>();

  public constructor (
    private designerService: DesignerService,
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry,
    /*private http: Http*/) {
    // Add custom material icons
    matIconRegistry.addSvgIcon('facebook', domSanitizer.bypassSecurityTrustResourceUrl("assets/icon/facebook.svg"));
    matIconRegistry.addSvgIcon('googleplus', domSanitizer.bypassSecurityTrustResourceUrl("assets/icon/googleplus.svg"));
    matIconRegistry.addSvgIcon('microsoft', domSanitizer.bypassSecurityTrustResourceUrl("assets/icon/microsoft.svg"));
  }

  // Variables
  state = true; // True if signing in, false if creating account
  welcomeName = 'Guest'; // The name displayed when logging in

  toggleState() {
      this.state = !this.state;
  }

  /* Sign In */

  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, Validators.minLength(8)]);

  getEmailErrorMessage() {
    return this.email.hasError('required') ? '' :
        this.email.hasError('email') ? 'Not a valid email' :
            '';
  }

  getPasswordErrorMessage() {
    return this.password.hasError('required') ? '' :
        this.password.hasError('minlength') ? 'Must be at least 8 characters' :
            '';
  }

  signIn() {
    const loginScreen = this;

      if (this.password.valid && this.email.valid) {
        const email = this.email.value;
        const password = this.password.value;
        const self = this;

        $.ajax({
            url: 'sign-in.php',
            type: 'POST',
            data: {'email': email, 'password': password},
            success: function(data) {
              if (data == 'null') {
                loginScreen.email.reset();
                loginScreen.password.reset();
                console.log("username or password incorrect");
              } else {
                loginScreen.welcomeName = JSON.parse(data);
                sessionStorage.setItem('username', loginScreen.welcomeName);
                sessionStorage.setItem('email', email);
                self.designerService.loadAllProjects(); // Load all projects with this username
                loginScreen.transition();
              }

            }

        });
      } else {
          // show errors
          this.email.markAsTouched();
          this.password.markAsTouched();
      }

  }

  /* Create Account */

  makeHide = true;
  makeUsername = new FormControl('', [Validators.required]);
  makeEmail = new FormControl('', [Validators.required, Validators.email]);
  makePassword = new FormControl('', [Validators.required, Validators.minLength(8)]);

  getMakeUsernameErrorMessage() {
    return this.makeUsername.hasError('required') ? 'Enter a Username' : '';
  }

  getMakeEmailErrorMessage() {
    return this.makeEmail.hasError('required') ? 'Enter your email' :
        this.makeEmail.hasError('email') ? 'Enter a valid email' :
            '';
  }

  // Gets error messaged depending on what isn't satisfied
  getMakePasswordErrorMessage() {
    return this.makePassword.hasError('required') ? 'Enter a password' :
        this.makePassword.hasError('minlength') ? 'Must be at least 8 characters' :
            '';
  }

  addToDatabase(name, email, password) {

  }

  createAccount() {
    const loginScreen = this;
    const xhttp = new XMLHttpRequest();

      if (this.makeUsername.valid && this.makeEmail.valid && this.makePassword.valid) {
          this.welcomeName = this.makeUsername.value;

          const name = this.makeUsername.value;
          const email = this.makeEmail.value;
          const password = this.makePassword.value;

          $.ajax({
            url: 'sign-up.php',
            type: 'POST',
            data: {'name': name, 'email': email, 'password': password},
            success: function(data) {
              if (data === '1') {
                loginScreen.makeEmail.setValue('Account already exists.');
                loginScreen.makePassword.reset();
                loginScreen.makeUsername.reset();
                console.log('account already exists');
              } else {
                sessionStorage.setItem('email', email);
                sessionStorage.setItem('username', loginScreen.welcomeName);
                loginScreen.transition();
              }

            }

          });

      } else {
          // show errors
          this.makeUsername.markAsTouched();
          this.makeEmail.markAsTouched();
          this.makePassword.markAsTouched();
      }
  }

  guestLogin() {
    sessionStorage.setItem('username', 'Guest');
    this.transition();
  }

  /* Transition */

  // If login or create account is successful, transition out of the login screen
  transition() {
      var loginScreen = this;

      // Show loading indicator
      document.getElementById("loading").style.display = 'block';
      // Fade out controls
      document.getElementById("content").style.transition = '0.5s';
      document.getElementById("content").style.opacity = '0';

      // Hide the controls after fading
      setTimeout(function() {
          document.getElementById("content").style.display = 'none';
      }, 500);

      // After loading for a bit, hide the login-screen
      setTimeout(function() {
          document.getElementById("login-view").style.transition = '0.5s';
          document.getElementById("login-view").style.opacity = '0';
      }, 1500);

      setTimeout(function() {
          loginScreen.login.emit(); // fire login event!
      }, 2000);
  }

}
