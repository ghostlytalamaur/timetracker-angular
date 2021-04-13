import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@tt/auth/core';

@Component({
  selector: 'tt-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  isSignedIn$: Observable<boolean>;

  constructor(private readonly authService: AuthService) {
    this.isSignedIn$ = this.authService.isSignedIn();
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
