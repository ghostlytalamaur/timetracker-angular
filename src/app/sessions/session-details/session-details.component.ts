import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionsService } from '../sessions.service';
import { Observable, of } from 'rxjs';
import { publishReplay, refCount, switchMap } from 'rxjs/operators';
import { Session } from '../model/session';
import { environment } from '../../../environments/environment';
import { NgForm } from '@angular/forms';
import { SessionEntity } from '../model/session-entity';
import { Update } from '../services/entity-storage';

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionDetailsComponent implements OnInit {

  readonly dateFormat = environment.settings.dateFormat;
  readonly timeFormat = environment.settings.timeFormat;
  readonly session$: Observable<Session | undefined>;

  constructor(
    private route: ActivatedRoute,
    private sessionsSrv: SessionsService
  ) {
    this.session$ = this.route.params
      .pipe(
        switchMap(params => {
          const id = params.id;
          if (id) {
            return this.sessionsSrv.getSession(id);
          } else {
            return of(undefined);
          }
        }),
        publishReplay(1),
        refCount()
      );
  }

  ngOnInit() {
  }

  onSubmit(session: Session, form: NgForm) {
    const date: Date = form.value.date;
    const start: Date = form.value.start;
    const end: Date = form.value.end;
    const changes: Update<SessionEntity> = {
      id: session.id,
      date: date.toDateString(),
      start: start.toTimeString(),
      end: end ? end.toTimeString() : null
    };
    this.sessionsSrv.updateSession(changes);
  }

  resetForm(session: Session, form: NgForm) {
    form.reset({
      date: session.date,
      start: session.start,
      end: session.end
    });
  }

}
