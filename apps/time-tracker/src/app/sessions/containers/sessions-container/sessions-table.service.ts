import { Injectable } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { Observable } from 'rxjs';


interface SessionsTableState {
  readonly expandedNodes: string[];
}

@Injectable({
  providedIn: 'root',
})
export class SessionsTableService extends RxState<SessionsTableState> {

  constructor() {
    super();
    this.set({
      expandedNodes: [],
    });
  }

  getExpandedNodes(): Observable<string[]> {
    return this.select('expandedNodes');
  }

  clearExpandedNodes(): void {
    this.set({ expandedNodes: [] });
  }

  toggleNode(nodeId: string): void {
    this.set(state => {
      const expandedNodes = state.expandedNodes.includes(nodeId)
        ? state.expandedNodes.filter(id => id !== nodeId)
        : state.expandedNodes.concat(nodeId);

      return { expandedNodes };
    });
  }
}
