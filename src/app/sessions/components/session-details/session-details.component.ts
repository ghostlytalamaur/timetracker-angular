import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DateTime, Duration } from 'luxon';
import { Observable, defer, merge, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { environment } from '../../../../environments/environment';
import { Session, SessionEntity, getDuration } from '../../models';

interface FormData {
  date: Date | null;
  start: Date | null;
  end: Date | null;
}

function withDate(date: DateTime, time: DateTime): DateTime {
  return DateTime.local(
    date.year, date.month, date.day,
    time.hour, time.minute, time.second, time.millisecond,
  );
}

@Component({
  selector: 'app-session-details',
  templateUrl: './session-details.component.html',
  styleUrls: ['./session-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailsComponent implements OnChanges {

  @Input() public session: Session;
  @Output() public saveSession: EventEmitter<SessionEntity>;

  readonly timeFormat = environment.settings.timeFormat;
  readonly form: FormGroup;
  readonly duration$: Observable<Duration | null>;

  constructor() {
    this.saveSession = new EventEmitter<SessionEntity>();
    const now = DateTime.local();
    this.form = new FormGroup({
      date: new FormControl(now, [Validators.required]),
      start: new FormControl(now, [Validators.required]),
      end: new FormControl(now),
    });

    this.duration$ = defer(() => merge(of(this.form.value), this.form.valueChanges))
      .pipe(
        switchMap((data: FormData) => {
          const start = data.start ? DateTime.fromJSDate(data.start) : null;
          let duration: Duration | null = null;
          if (start && data.end) {
            duration = withDate(start, DateTime.fromJSDate(data.end)).diff(start);
          }

          return getDuration(start, duration, environment.settings.durationRate);
        }),
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.session) {
      this.form.setValue(this.sessionToFormData());
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    const date: DateTime = DateTime.fromJSDate(this.form.value.date);
    const start: DateTime = withDate(date, DateTime.fromJSDate(this.form.value.start));
    const end: DateTime | null = this.form.value.end ? withDate(date, DateTime.fromJSDate(this.form.value.end)) : null;
    const sessionEntity: SessionEntity = {
      id: this.session && this.session.id || uuid(),
      start: start.valueOf(),
      duration: end ? end.valueOf() - start.valueOf() : null,
    };
    this.saveSession.emit(sessionEntity);
  }

  resetForm() {
    this.form.reset(this.sessionToFormData());
  }

  private sessionToFormData(): FormData {
    return {
      date: this.session && this.session.start ? this.session.start.toJSDate() : null,
      start: this.session && this.session.start ? this.session.start.toJSDate() : null,
      end: this.session && this.session.start && this.session.duration ? this.session.start.plus(this.session.duration).toJSDate() : null,
    };
  }


}
