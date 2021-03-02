import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/core/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, take, tap } from 'rxjs/operators';

import { SessionsTableActions } from '../actions';
import * as fromFeature from '../reducers';
import { SessionsTableSelectors } from '../selectors';

@Injectable()
export class SessionsTableEffects {

  persistTableState$ = createEffect(() =>
      this.actions
        .pipe(
          ofType(
            SessionsTableActions.clearExpandedNodes,
            SessionsTableActions.toggleNode,
          ),
          switchMap(() =>
            this.store.select(SessionsTableSelectors.selectSessionsTableState)
              .pipe(
                take(1),
                tap(state => LocalStorageService.setItem(fromFeature.featureKey, 'table', state)),
              ),
          ),
        ),
    { dispatch: false },
  );

  constructor(
    private readonly actions: Actions,
    private readonly store: Store,
  ) {
  }

}
