import { Component, HostBinding, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TICKS_TIMER } from '@app/core/services';
import { getDuration$, Session } from '@app/store';
import { Duration } from 'luxon';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-sessions-table-row',
  templateUrl: './sessions-table-row.component.html',
  styleUrls: ['./sessions-table-row.component.scss'],
})
export class SessionsTableRowComponent implements OnInit, OnChanges {

  @Input() session!: Session;
  @Input() showDate = false;

  @HostBinding('class')
  readonly class = 'd-block bg-card bg-hover cursor-pointer';

  readonly dateFormat = environment.settings.dateFormat;
  readonly timeFormat = environment.settings.timeFormat;
  duration$!: Observable<Duration | null>;
  private readonly session$$ = new BehaviorSubject<Session | null>(null);

  constructor(
    @Inject(TICKS_TIMER)
    private readonly ticks$: Observable<number>,
  ) {
  }

  ngOnInit(): void {
    this.duration$ = this.session$$.pipe(
      switchMap(session => getDuration$(this.ticks$, () => session?.calculateDuration() ?? null)),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.session) {
      this.session$$.next(this.session);
    }
  }

}
