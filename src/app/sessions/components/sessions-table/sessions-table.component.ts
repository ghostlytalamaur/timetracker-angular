import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Session, SessionTag, SessionsGroupType, SortType } from '@app/store';

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

  @Input() sessions: Session[] = [];
  @Input() groupType: SessionsGroupType = 'none';
  @Input() sortType!: SortType;
  @Input() expandedNodes: string[] = [];
  @Input() tags: SessionTag[] = [];
  @Output() toggleSessionTag = new EventEmitter<{ sessionId: string; tagId: string }>();
  @Output() deleteSessions: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() toggleNode = new EventEmitter<string>();

  constructor(
    readonly model: SessionTreeModel,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
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

  hasChild(index: number, node: FlatNode): boolean {
    return node.expandable;
  }

  onToggleNode(node: FlatNode): void {
    this.toggleNode.emit(node.node.id);
  }

  onDeleteSessions(sessions: Session[]): void {
    this.deleteSessions.emit(sessions.map(s => s.id));
  }

  onToggleSessionTag(sessionId: string, tagId: string): void {
    this.toggleSessionTag.emit({ sessionId, tagId });
  }
}
