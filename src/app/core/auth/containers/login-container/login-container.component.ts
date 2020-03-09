import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../../auth.service';
import { Credentials } from '../../model';

@Component({
  selector: 'app-login',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss'],
})
export class LoginContainerComponent implements OnInit {

  public isLoading$: Observable<boolean>;
  public error$: Observable<string | undefined>;

  public constructor(
    private readonly authService: AuthService,
  ) {
    this.isLoading$ = this.authService.isLoading();
    this.error$ = this.authService.getError();
  }

  public ngOnInit() {
  }

  public onSignIn(credentials: Credentials) {
    this.authService.signIn(credentials);
  }

  public onSignUp(credentials: Credentials) {
    this.authService.signUp(credentials);
  }

}
