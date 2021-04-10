import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Session, SessionsService } from '@app/store';
import { ISession } from '@timetracker/shared';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Nullable } from '../../../shared/utils';


@Component({
  selector: 'app-session-details-container',
  templateUrl: './session-details-container.component.html',
  styleUrls: ['./session-details-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailsContainerComponent implements OnInit {

  error!: string;
  session$!: Observable<Nullable<Session>>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionsSrv: SessionsService,
  ) {
  }

  ngOnInit() {
    this.session$ = this.route.params
      .pipe(
        switchMap(params => params.id ? this.getSession(params.id) : of(null)),
      );
  }

  onSaveSession(session: ISession): void {
    this.sessionsSrv.updateSession({
      id: session.id,
      changes: session,
    });
    this.router.navigate(['../'], { relativeTo: this.route }).catch(console.log);
  }

  private getSession(id: string): Observable<Nullable<Session>> {
    return this.sessionsSrv.getSession$(id)
      .pipe(
        tap(s => {
          this.error = !s ? 'Session with this id doesn\'t exists' : '';
        }),
      );
  }
}
