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
  @Input() public expandedNodes: string[] = [];
  @Output() public deleteSessions: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() public toggleNode = new EventEmitter<string>();

  public constructor(
    public readonly model: SessionTreeModel,
  ) {
  }

  public ngOnInit(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    let shouldUpdate = false;
    if (changes.groupType) {
      this.model.setGroupType(this.groupType);
      shouldUpdate = true;
    }

    if (changes.sessions) {
      this.model.setSessions(this.sessions);
      shouldUpdate = true;
    }

    if (changes.sortType) {
      this.model.setSorting(this.sortType);
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      this.model.update();
    }

    if (changes.expandedNodes) {
      this.model.expandNodes(this.expandedNodes);
    }
  }

  public hasChild(index: number, node: FlatNode): boolean {
    return node.expandable;
  }

  public onToggleNode(node: FlatNode): void {
    this.toggleNode.emit(node.node.id);
  }

  public onDeleteSessions(sessions: Session[]): void {
    this.deleteSessions.emit(sessions.map(s => s.id));
  }
}
