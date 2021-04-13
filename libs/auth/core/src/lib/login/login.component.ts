import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Component({
  selector: 'tt-login',
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  isLoading$: Observable<boolean>;
  error$: Observable<string | undefined>;

  constructor(private readonly authService: AuthService) {
    this.isLoading$ = this.authService.isLoading$();
    this.error$ = this.authService.getError();
  }

  public ngOnInit(): void {
    this.authService.signIn();
  }
}
