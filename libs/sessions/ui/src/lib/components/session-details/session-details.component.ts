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
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ISession } from '@tt/shared';
import { DateTime, Duration } from 'luxon';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { getDuration$, Session } from '@tt/sessions/core';
import { ENVIRONMENT, IEnvironment, TICKS_TIMER } from '@tt/core/services';

interface FormData {
  date: Date | null;
  start: Date | null;
  end: Date | null;
}

function withDate(date: DateTime, time: DateTime): DateTime {
  return DateTime.local(
    date.year,
    date.month,
    date.day,
    time.hour,
    time.minute,
    time.second,
    time.millisecond,
  );
}

@Component({
  selector: 'tt-session-details',
  templateUrl: './session-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDetailsComponent implements OnChanges {
  @Input() session!: Session;
  @Output() saveSession = new EventEmitter<ISession>();

  readonly timeFormat = this.env.settings.timeFormat;
  readonly form: UntypedFormGroup;
  readonly duration$: Observable<Duration | null>;

  constructor(
    @Inject(ENVIRONMENT)
    private readonly env: IEnvironment,
    @Inject(TICKS_TIMER)
    private readonly ticks$: Observable<number>,
  ) {
    const now = new Date();
    this.form = new UntypedFormGroup({
      date: new UntypedFormControl(now, [Validators.required]),
      start: new UntypedFormControl(now, [Validators.required]),
      end: new UntypedFormControl(now),
    });

    this.duration$ = getDuration$(this.ticks$, () => {
      const date = DateTime.fromJSDate(this.form.value.date);
      const start = withDate(date, DateTime.fromJSDate(this.form.value.start));
      const end = withDate(date, DateTime.fromJSDate(this.form.value.end ?? new Date()));

      return end.diff(start);
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

    const date = DateTime.fromJSDate(this.form.value.date);
    const start = withDate(date, DateTime.fromJSDate(this.form.value.start));
    const end = this.form.value.end
      ? withDate(date, DateTime.fromJSDate(this.form.value.end))
      : null;
    const sessionEntity: ISession = {
      id: this.session?.id ?? uuid(),
      start: start.toISO(),
      duration: end ? end.valueOf() - start.valueOf() : null,
      tags: this.session?.tags.map((t) => t.id) ?? [],
    };
    this.saveSession.emit(sessionEntity);
  }

  resetForm() {
    this.form.reset(this.sessionToFormData());
  }

  private sessionToFormData(): FormData {
    return {
      date: this.session?.start.toJSDate() ?? null,
      start: this.session?.start.toJSDate() ?? null,
      end:
        this.session && this.session.start && this.session.duration
          ? this.session.start.plus(this.session.duration).toJSDate()
          : null,
    };
  }
}