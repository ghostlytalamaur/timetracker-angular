import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { Session, SessionsGroupType, SortType } from '../../models';

import { FlatNode, SessionTreeModel } from './session-tree.model';

@Component({
  selector: 'app-sessions-table',
  templateUrl: './sessions-table.component.html',
  styleUrls: ['./sessions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    SessionTreeModel,
  ],
})
export class SessionsTableComponent implements OnInit, OnChanges {

  @Input() public sessions: Session[] = [];
  @Input() public groupType: SessionsGroupType = 'none';
  @Input() public sortType: SortType;
  @Output() public deleteSessions: EventEmitter<string[]> = new EventEmitter<string[]>();

  public constructor(
    public readonly model: SessionTreeModel,
  ) {
  }

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.groupType) {
      this.model.setGroupType(this.groupType);
    }

    if (changes.sessions) {
      this.model.setSessions(this.sessions);
    }

    if (changes.sortType) {
      this.model.setSorting(this.sortType);
    }

    this.model.update();
  }

  public hasChild(index: number, node: FlatNode): boolean {
    return node.expandable;
  }

  public toggleNode(node: FlatNode): void {
    this.model.treeControl.toggle(node);
  }

  public onDeleteSessions(sessions: Session[]): void {
    this.deleteSessions.emit(sessions.map(s => s.id));
  }
}
