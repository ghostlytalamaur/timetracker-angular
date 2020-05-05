import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SessionsTableActions } from '../../store/actions';
import { SessionsTableSelectors } from '../../store/selectors';

@Injectable({
  providedIn: 'root',
})
export class SessionsTableService {

  public constructor(
    private readonly store: Store,
  ) {
  }

  public getExpandedNodes(): Observable<string[]> {
    return this.store.select(SessionsTableSelectors.selectExpandedNodes);
  }

  public clearExpandedNodes(): void {
    this.store.dispatch(SessionsTableActions.clearExpandedNodes());
  }

  public toggleNode(nodeId: string): void {
    this.store.dispatch(SessionsTableActions.toggleNode({ nodeId }));
  }
}
