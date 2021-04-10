import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginContainerComponent implements OnInit {

  isLoading$: Observable<boolean>;
  error$: Observable<string | undefined>;

  constructor(
    private readonly authService: AuthService,
  ) {
    this.isLoading$ = this.authService.isLoading$();
    this.error$ = this.authService.getError();
  }

  public ngOnInit(): void {
    this.authService.signIn();
  }

}
