import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from '../core/auth/auth.service';

import { routerAnimation } from './animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routerAnimation],
})
export class AppComponent {

  public isSignedIn$: Observable<boolean>;

  public constructor(
    private readonly authService: AuthService,
  ) {
    this.isSignedIn$ = this.authService.isSignedIn();
  }

  public onSignOut(): void {
    this.authService.logout();
  }
}
