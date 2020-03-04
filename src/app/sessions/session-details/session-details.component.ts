import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionsService } from '../sessions.service';
import { defer, merge, Observable, of, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { getDuration, Session } from '../model/session';
import { environment } from '../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SessionEntity } from '../model/session-entity';
import { Update } from '../services/entity-storage';
import { v4 as uuid } from 'uuid';
import { DateTime, Duration } from 'luxon';

interface FormData {
  date: Date | null;
  start: Date | null;
  end: Date | null;
}

function withDate(date: DateTime, time: DateTime): DateTime {
  return DateTime.local(
    date.year, date.month, date.day,
    time.hour, time.minute, time.second, time.millisecond
  );
}

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionDetailsComponent implements OnInit, OnDestroy {

  readonly timeFormat = environment.settings.timeFormat;
  readonly form: FormGroup;
  readonly duration$: Observable<Duration | null>;
  error: string;
  private subscription: Subscription | undefined;
  private session: Session | undefined;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionsSrv: SessionsService
  ) {
    const now = DateTime.local();
    this.form = new FormGroup({
      date: new FormControl(now, [Validators.required]),
      start: new FormControl(now, [Validators.required]),
      end: new FormControl(now)
    });

    this.duration$ = defer(() => merge(of(this.form.value), this.form.valueChanges))
      .pipe(
        switchMap((data: FormData) => {
          const start = data.start ? DateTime.fromJSDate(data.start) : null;
          let duration: Duration | null = null;
          if (data.start && data.end) {
            duration = DateTime.fromJSDate(data.end).diff(DateTime.fromJSDate(data.start));
          }

          return getDuration(start, duration, environment.settings.durationRate);
        })
      );
  }

  ngOnInit() {
    this.subscription = this.route.params
      .pipe(
        switchMap(params => params.id ? this.getSession(params.id) : of(undefined))
      )
      .subscribe(
        session => {
          this.session = session;
          this.form.setValue(this.sessionToFormData());
        },
        (err: Error) => this.error = err.message
      );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const date: DateTime = DateTime.fromJSDate(this.form.value.date);
    const start: DateTime = withDate(date, DateTime.fromJSDate(this.form.value.start));
    const end: DateTime | null = this.form.value.end ? withDate(date, DateTime.fromJSDate(this.form.value.end)) : null;
    const changes: Update<SessionEntity> = {
      id: this.session && this.session.id || uuid(),
      start: start.valueOf(),
      duration: end ? end.valueOf() - start.valueOf() : null
    };

    this.sessionsSrv.updateSession(changes);
    this.router.navigate(['../'], { relativeTo: this.route }).catch(console.log);
  }

  resetForm() {
    this.form.reset(this.sessionToFormData());
  }

  private sessionToFormData(): FormData {
    return {
      date: this.session && this.session.start ? this.session.start.toJSDate() : null,
      start: this.session && this.session.start ? this.session.start.toJSDate() : null,
      end: this.session && this.session.start && this.session.duration ? this.session.start.plus(this.session.duration).toJSDate() : null
    };
  }

  private getSession(id: string): Observable<Session | undefined> {
    return this.sessionsSrv.getSession(id)
      .pipe(
        tap(s => {
          if (!s) {
            throw new Error('Session with this id doesn\'t exists');
          }
        })
      );
  }

}
