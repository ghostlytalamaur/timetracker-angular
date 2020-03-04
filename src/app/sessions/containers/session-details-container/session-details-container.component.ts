import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsService } from '../../services/sessions.service';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Session, SessionEntity } from '../../models';

@Component({
  selector: 'app-session-details-container',
  templateUrl: './session-details-container.component.html',
  styleUrls: ['./session-details-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionDetailsContainerComponent implements OnInit {

  public error: string;
  public session$: Observable<Session | null>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionsSrv: SessionsService
  ) {
  }

  ngOnInit() {
    this.session$ = this.route.params
      .pipe(
        switchMap(params => params.id ? this.getSession(params.id) : of(null)),
      );
  }

  public onSaveSession(session: SessionEntity): void {
    this.sessionsSrv.updateSession(session);
    this.router.navigate(['../'], { relativeTo: this.route }).catch(console.log);
  }

  private getSession(id: string): Observable<Session | null> {
    return this.sessionsSrv.getSession(id)
      .pipe(
        tap(s => {
          this.error = !s ? 'Session with this id doesn\'t exists' : '';
        }),
        map(s => s ? s : null),
      );
  }
}
