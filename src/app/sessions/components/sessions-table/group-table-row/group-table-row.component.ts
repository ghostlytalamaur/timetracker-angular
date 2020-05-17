import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SessionsGroup, SessionsGroupType, getGroupDuration } from '@app/store';
import { Duration } from 'luxon';
import { Observable } from 'rxjs';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-group-table-row',
  templateUrl: './group-table-row.component.html',
  styleUrls: ['./group-table-row.component.scss'],
})
export class GroupTableRowComponent implements OnInit, OnChanges {

  @Input() public group: SessionsGroup;

  public duration$: Observable<Duration>;
  public text: string;

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.group) {
      this.duration$ = getGroupDuration(this.group.sessions);
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
      this.text = `${this.group.date.startOf('week').toFormat(dateFormat[this.group.type])} - ${this.group.date.endOf('week').toFormat(dateFormat[this.group.type])}`;
    } else {
      this.text = this.group.date.toFormat(dateFormat[this.group.type]);
    }
  };
}
