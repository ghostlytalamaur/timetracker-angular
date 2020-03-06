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

  public isLoading$: Observable<boolean>;
  public error$: Observable<string | undefined>;
  public isSignInMode = true;

  public constructor(
    private readonly authService: AuthService,
  ) {
    this.isLoading$ = this.authService.isLoading();
    this.error$ = this.authService.getError();
  }

  public ngOnInit() {
  }

  public onSubmit(form: NgForm) {
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

  public onSwitchMode() {
    this.isSignInMode = !this.isSignInMode;
  }
}
