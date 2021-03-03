import { Component, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TICKS_TIMER } from '@app/core/services';
import { getDuration$, SessionsGroup, SessionsGroupType } from '@app/store';
import { Duration } from 'luxon';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';


@Component({
  selector: 'app-group-table-row',
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
  ) {
  }

  ngOnInit(): void {
    this.duration$ = this.group$$.pipe(
      switchMap(group => getDuration$(this.ticks$, () => group?.calculateDuration() ?? null)),
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
      none: environment.settings.dateFormat,
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
