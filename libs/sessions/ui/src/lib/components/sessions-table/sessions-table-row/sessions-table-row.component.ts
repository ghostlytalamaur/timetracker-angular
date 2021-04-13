import {
  Component,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Duration } from 'luxon';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getDuration$, Session } from '@tt/sessions/core';
import { ENVIRONMENT, IEnvironment, TICKS_TIMER } from '@tt/core/services';

@Component({
  selector: 'tt-sessions-table-row',
  templateUrl: './sessions-table-row.component.html',
  styleUrls: ['./sessions-table-row.component.scss'],
})
export class SessionsTableRowComponent implements OnInit, OnChanges {
  @Input() session!: Session;
  @Input() showDate = false;

  @HostBinding('class')
  readonly class = 'd-block bg-card bg-hover cursor-pointer';

  readonly dateFormat = this.env.settings.dateFormat;
  readonly timeFormat = this.env.settings.timeFormat;
  duration$!: Observable<Duration | null>;
  private readonly session$$ = new BehaviorSubject<Session | null>(null);

  constructor(
    @Inject(ENVIRONMENT) private readonly env: IEnvironment,
    @Inject(TICKS_TIMER)
    private readonly ticks$: Observable<number>,
  ) {}

  ngOnInit(): void {
    this.duration$ = this.session$$.pipe(
      switchMap((session) => getDuration$(this.ticks$, () => session?.calculateDuration() ?? null)),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.session) {
      this.session$$.next(this.session);
    }
  }
}
