import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { Credentials } from '../../model';


@Component({
  selector: 'app-login',
  templateUrl: './login-container.component.html',
  styleUrls: ['./login-container.component.scss'],
})
export class LoginContainerComponent {

  isLoading$: Observable<boolean>;
  error$: Observable<string | undefined>;

  constructor(
    private readonly authService: AuthService,
  ) {
    this.isLoading$ = this.authService.isLoading();
    this.error$ = this.authService.getError();
  }

  onSignIn(credentials: Credentials) {
    this.authService.signIn(credentials);
  }

  onSignUp(credentials: Credentials) {
    this.authService.signUp(credentials);
  }

}
