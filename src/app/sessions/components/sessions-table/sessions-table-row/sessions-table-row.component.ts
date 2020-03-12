import { Component, OnInit, Input, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { SessionRow } from '../session-table.model';
import { Observable } from 'rxjs';
import { Duration } from 'luxon';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-sessions-table-row',
  templateUrl: './sessions-table-row.component.html',
  styleUrls: ['./sessions-table-row.component.scss'],
})
export class SessionsTableRowComponent implements OnInit, OnChanges {

  @Input() public session: SessionRow;
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
      this.duration$ = this.session.duration$;
    }
  }

}
