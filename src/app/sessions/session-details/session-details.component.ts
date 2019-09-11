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

interface FormData {
  date: Date | null;
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionDetailsComponent implements OnInit, OnDestroy {

  readonly dateFormat = environment.settings.dateFormat;
  readonly timeFormat = environment.settings.timeFormat;
  readonly form: FormGroup;
  readonly duration$: Observable<number | undefined>;
  error: string;
  private subscription: Subscription | undefined;
  private session: Session | undefined;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionsSrv: SessionsService
  ) {
    this.form = new FormGroup({
      date: new FormControl(undefined, [Validators.required]),
      start: new FormControl(undefined, [Validators.required]),
      end: new FormControl()
    });

    this.duration$ = defer(() => merge(of(this.form.value), this.form.valueChanges))
      .pipe(
        switchMap((data: FormData) => getDuration(data.start, data.end, environment.settings.durationRate))
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

    const date: Date = this.form.value.date;
    const start: Date = this.form.value.start;
    const end: Date = this.form.value.end;
    const changes: Update<SessionEntity> = {
      id: this.session && this.session.id || uuid(),
      date: date.toDateString(),
      start: start.toTimeString(),
      end: end ? end.toTimeString() : null
    };
    this.sessionsSrv.updateSession(changes);
    this.router.navigate(['../'], { relativeTo: this.route }).catch(console.log);
  }

  resetForm() {
    this.form.reset(this.sessionToFormData());
  }

  private sessionToFormData(): FormData {
    return {
      date: this.session && this.session.date || null,
      start: this.session && this.session.start || null,
      end: this.session && this.session.end || null
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
