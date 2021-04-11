import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthService } from '@app/core/auth';
import { routerAnimation } from '@app/shared/animations';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routerAnimation],
})
export class AppComponent {
  isSignedIn$: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    this.isSignedIn$ = this.authService.isSignedIn();
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
