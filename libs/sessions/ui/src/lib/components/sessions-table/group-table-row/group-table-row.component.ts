import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Duration } from 'luxon';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { getDuration$, SessionsGroup, SessionsGroupType } from '@tt/sessions/core';
import { ENVIRONMENT, IEnvironment, TICKS_TIMER } from '@tt/core/services';


@Component({
  selector: 'tt-group-table-row',
  templateUrl: './group-table-row.component.html',
  styleUrls: ['./group-table-row.component.scss'],
})
export class GroupTableRowComponent implements OnInit, OnChanges {
  @Input() group!: SessionsGroup;

  duration$!: Observable<Duration | null>;
  text!: string;

  private readonly group$$ = new BehaviorSubject<SessionsGroup | null>(null);

  constructor(
    @Inject(TICKS_TIMER)
    private readonly ticks$: Observable<number>,
    @Inject(ENVIRONMENT) private readonly env: IEnvironment
  ) {}

  ngOnInit(): void {
    this.duration$ = this.group$$.pipe(
      switchMap((group) => getDuration$(this.ticks$, () => group?.calculateDuration() ?? null)),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.group) {
      this.group$$.next(this.group);
      this.updateText();
    }
  }

  private updateText(): void {
    const dateFormat: Record<SessionsGroupType, string> = {
      none: this.env.settings.dateFormat,
      day: 'MMMM d, y',
      week: 'MMMM d, y',
      month: 'MMMM, y',
      year: 'y',
    };

    if (this.group.type === 'week') {
      this.text = `${this.group.date.startOf('week').toFormat(dateFormat[this.group.type])} -
          ${this.group.date.endOf('week').toFormat(dateFormat[this.group.type])}`;
    } else {
      this.text = this.group.date.toFormat(dateFormat[this.group.type]);
    }
  }
}
