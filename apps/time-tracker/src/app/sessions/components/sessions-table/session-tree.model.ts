import { FlatTreeControl } from '@angular/cdk/tree';
import { Injectable } from '@angular/core';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Nullable, clustering } from '@app/shared/utils';
import {
  Session,
  SessionsGroup,
  SessionsGroupType,
  SortType,
  createGroup,
  getGroupId,
} from '@app/store';
import { contramap, fromCompare, getDualOrd } from 'fp-ts/es6/Ord';
import { DateTime } from 'luxon';

export type TreeNode = SessionsGroup | Session;

function retainKeys<K, V>(values: Map<K, V>, keys: Set<K>): void {
  const existingKeys = [...values.keys()];
  for (const key of existingKeys) {
    if (!keys.has(key)) {
      values.delete(key);
    }
  }
}

export interface FlatNode {
  level: number;
  expandable: boolean;
  node: TreeNode;
}

const ordDateTime = fromCompare<DateTime>((d1, d2) => (d1 < d2 ? -1 : d1 > d2 ? 1 : 0));
const ordTreeNode = contramap<DateTime, TreeNode>((a) =>
  a instanceof SessionsGroup ? a.date : a.start,
)(ordDateTime);

@Injectable()
export class SessionTreeModel {
  readonly treeControl: FlatTreeControl<FlatNode>;
  readonly dataSource: MatTreeFlatDataSource<TreeNode, FlatNode>;

  private nodes: TreeNode[] = [];
  private groupType!: SessionsGroupType;
  private sessions!: Session[];

  private readonly nodeToFlatNode: Map<string, FlatNode>;
  private sortType: SortType = 'asc';

  constructor() {
    this.nodeToFlatNode = new Map<string, FlatNode>();

    const flattener = new MatTreeFlattener<TreeNode, FlatNode>(
      (node, level) => {
        const flatNode: FlatNode = this.nodeToFlatNode.get(node.id) || ({} as FlatNode);
        this.nodeToFlatNode.set(node.id, flatNode);

        flatNode.level = level;
        flatNode.node = node;
        flatNode.expandable = node instanceof SessionsGroup;

        return flatNode;
      },
      (flatNode) => flatNode.level,
      (flatNode) => flatNode.expandable,
      (node) => (node instanceof SessionsGroup ? node.sessions : null),
    );

    this.treeControl = new FlatTreeControl<FlatNode>(
      (flatNode) => flatNode.level,
      (flatNode) => flatNode.expandable,
    );
    this.dataSource = new MatTreeFlatDataSource<TreeNode, FlatNode>(this.treeControl, flattener);
  }

  setGroupType(type: Nullable<SessionsGroupType>): this {
    if (type) {
      this.groupType = type;
      this.nodeToFlatNode.clear();
    }

    return this;
  }

  setSessions(sessions: Nullable<Session[]>): this {
    if (sessions) {
      this.sessions = sessions;
    }

    return this;
  }

  setSorting(type: Nullable<SortType>): this {
    if (type) {
      this.sortType = type;
    }

    return this;
  }

  update(): this {
    if (this.groupType === 'none') {
      this.updateSessions();
    } else {
      this.updateGroups();
    }

    this.dataSource.data = this.nodes;
    const allNodes = this.nodes.reduce((acc, node) => {
      if (node instanceof SessionsGroup) {
        node.sessions.forEach((session) => acc.add(session.id));
      }
      acc.add(node.id);

      return acc;
    }, new Set<string>());
    retainKeys(this.nodeToFlatNode, allNodes);

    return this;
  }

  expandNodes(expandedNodes: Nullable<string[]>): void {
    if (expandedNodes) {
      const nodes = this.treeControl.dataNodes;
      const expandedIds = new Set<string>(expandedNodes);
      for (const node of nodes) {
        if (!this.treeControl.isExpandable(node)) {
          continue;
        }

        const isExpanded = this.treeControl.isExpanded(node);
        if (expandedIds.has(node.node.id) && !isExpanded) {
          this.treeControl.expand(node);
        } else if (!expandedIds.has(node.node.id) && isExpanded) {
          this.treeControl.collapse(node);
        }
      }
    }
  }

  private updateSessions(): void {
    this.nodes = [...this.sessions];
    this.sortNodes(this.nodes);
  }

  private updateGroups(): void {
    this.nodes = [];
    const clusters = clustering(this.sessions, (session) => getGroupId(session, this.groupType));

    for (const cluster of clusters) {
      const groupId = getGroupId(cluster[0], this.groupType);
      const date = cluster.reduce(
        (min, session) => (session.start < min ? session.start : min),
        cluster[0].start,
      );
      this.sortNodes(cluster);
      this.nodes.push(createGroup(groupId, this.groupType, date, cluster));
    }
    this.sortNodes(this.nodes);
  }

  private sortNodes(nodes: TreeNode[]) {
    nodes.sort(this.sortType === 'asc' ? ordTreeNode.compare : getDualOrd(ordTreeNode).compare);
  }
}
