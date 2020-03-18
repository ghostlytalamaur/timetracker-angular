import { Component, OnInit, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { Observable } from 'rxjs';
import { Duration } from 'luxon';
import { environment } from '../../../../../environments/environment';
import { Session, getDuration } from '../../../models';

@Component({
  selector: 'app-sessions-table-row',
  templateUrl: './sessions-table-row.component.html',
  styleUrls: ['./sessions-table-row.component.scss'],
})
export class SessionsTableRowComponent implements OnInit, OnChanges {

  @Input() public session: Session;
  @Input() public showDate = false;

  @HostBinding('class')
  public readonly class = 'd-block bg-card bg-hover cursor-pointer';

  public readonly dateFormat = environment.settings.dateFormat;
  public readonly timeFormat = environment.settings.timeFormat;
  public duration$: Observable<Duration>;

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.session) {
      this.duration$ = getDuration(this.session.start, this.session.duration, environment.settings.durationRate);
    }
  }

}
