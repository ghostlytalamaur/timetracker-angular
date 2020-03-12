import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GroupRow } from '../session-table.model';
import { Observable } from 'rxjs';
import { Duration } from 'luxon';

@Component({
  selector: 'app-group-table-row',
  templateUrl: './group-table-row.component.html',
  styleUrls: ['./group-table-row.component.scss'],
})
export class GroupTableRowComponent implements OnInit, OnChanges {

  @Input() public group: GroupRow;

  public duration$: Observable<Duration>;

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.group) {
      this.duration$ = this.group.duration$;
    }
  }

}
