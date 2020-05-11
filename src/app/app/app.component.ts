import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/auth';
import { routerAnimation } from '@app/shared/animations';
import { SessionsService, SessionsTagsService } from '@app/store';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routerAnimation],
})
export class AppComponent implements OnInit {

  public isSignedIn$: Observable<boolean>;

  public constructor(
    private readonly authService: AuthService,
    private readonly sessionsService: SessionsService,
    private readonly tagsService: SessionsTagsService,
  ) {
    this.isSignedIn$ = this.authService.isSignedIn();
  }

  public ngOnInit(): void {
    this.tagsService.requestTags();
    this.sessionsService.requestSessions();
  }

  public onSignOut(): void {
    this.authService.logout();
  }
}
