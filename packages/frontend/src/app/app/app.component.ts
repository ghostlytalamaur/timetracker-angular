import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {

  isSignedIn$: Observable<boolean>;

  constructor(
    private readonly authService: AuthService,
  ) {
    this.isSignedIn$ = this.authService.isSignedIn();
  }

  ngOnInit(): void {
  }

  onSignOut(): void {
    this.authService.logout();
  }
}
