import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { Session, SessionsGroupType } from '../../models';

import { SessionTableModelBuilder, TableRow } from './session-table.model';


@Component({
  selector: 'app-sessions-table',
  templateUrl: './sessions-table.component.html',
  styleUrls: ['./sessions-table.component.scss'],
})
export class SessionsTableComponent implements OnInit, OnChanges {

  @Input() public sessions: Session[] = [];
  @Input() public groupType: SessionsGroupType = 'none';

  public readonly dateFormat = environment.settings.dateFormat;
  public readonly timeFormat = environment.settings.timeFormat;

  public rows: TableRow[] = [];

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.sessions || changes.groupType) {
      this.rows = new SessionTableModelBuilder(this.groupType, this.sessions).build();
    } else {
      this.rows = [];
    }
  }

  public isGroupTemplate(index: number, row: TableRow): boolean {
    return row.type === 'group';
  };

  public trackById(index: number, row: TableRow): string {
    return row.id;
  }

}
