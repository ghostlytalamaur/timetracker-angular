import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '@tt/auth/core';
import { ConnectionService } from '@tt/core/api';

@Component({
  selector: 'tt-top-bar',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  isSignedIn$!: Observable<boolean>;
  isOnline$!: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
    private readonly connection: ConnectionService,
  ) {}

  ngOnInit(): void {
    this.isSignedIn$ = this.authService.isSignedIn();
    this.isOnline$ = this.connection.isOnline$();
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
