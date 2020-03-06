import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  isLoading$: Observable<boolean>;
  error$: Observable<string | undefined>;
  isSignInMode = true;

  constructor(
    private readonly authService: AuthService,
  ) {
    this.isLoading$ = this.authService.isLoading();
    this.error$ = this.authService.getError();
  }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    const credentials = {
      email: form.value.email,
      password: form.value.password,
    };
    if (this.isSignInMode) {
      this.authService.signIn(credentials);
    } else {
      this.authService.signUp(credentials);
    }
  }

  onSwitchMode() {
    this.isSignInMode = !this.isSignInMode;
  }
}
