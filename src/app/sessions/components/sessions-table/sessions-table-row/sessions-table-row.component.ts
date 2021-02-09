import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Session, getDuration } from '@app/store';
import { Duration } from 'luxon';
import { Observable } from 'rxjs';

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
  duration$!: Observable<Duration>;

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.session) {
      this.duration$ = getDuration(this.session.start, this.session.duration);
    }
  }

}
