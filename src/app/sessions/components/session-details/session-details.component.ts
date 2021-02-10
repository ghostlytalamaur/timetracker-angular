import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TICKS_TIMER } from '@app/core/services';
import { getDuration$, Session, SessionEntity } from '@app/store';
import { DateTime, Duration } from 'luxon';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

import { environment } from '../../../../environments/environment';

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

  @Input() session!: Session;
  @Output() saveSession: EventEmitter<SessionEntity>;

  readonly timeFormat = environment.settings.timeFormat;
  readonly form: FormGroup;
  readonly duration$: Observable<Duration | null>;

  constructor(
    @Inject(TICKS_TIMER)
    private readonly ticks$: Observable<number>,
  ) {
    this.saveSession = new EventEmitter<SessionEntity>();
    const now = new Date();
    this.form = new FormGroup({
      date: new FormControl(now, [Validators.required]),
      start: new FormControl(now, [Validators.required]),
      end: new FormControl(now),
    });

    this.duration$ = getDuration$(this.ticks$, () => {
      const start = this.form.value.start;
      const end = this.form.value.end ?? new Date();
      if (start && end) {
        return DateTime.fromJSDate(end).diff(DateTime.fromJSDate(start));
      } else {
        return null;
      }
    });
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
      tags: this.session ? this.session.tags.map(t => t.id) : [],
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
