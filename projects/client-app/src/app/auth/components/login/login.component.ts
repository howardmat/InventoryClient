import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check authService for rememberMe setting and prefill email
    const defaultEmail = this.authService.getRememberMeEmail();

    // Create new form group for form controls
    this.loginFormGroup = new FormGroup({
      email: new FormControl(defaultEmail, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      rememberMe: new FormControl(defaultEmail ? true : null)
    });
  }

  onSubmit(loginForm: FormGroupDirective): void {
    // Check if form is valid before continuing
    if (!this.loginFormGroup.valid) {
      return;
    }

    // Set isLoading to enable spinner
    this.isLoading = true;

    // Try to log user in
    this.authService
      .login(
        this.loginFormGroup.get('email')?.value,
        this.loginFormGroup.get('password')?.value,
        this.loginFormGroup.get('rememberMe')?.value
      )
      .subscribe(
        userData => {
          // Handle the success
          this.router.navigate(["/dashboard"]);
        },
        error => {
          // Handle the error
          this.error = error;
          this.isLoading = false;
        }
      );
    
    // Reset form
    loginForm.resetForm();
    this.loginFormGroup.reset();
  }

}
