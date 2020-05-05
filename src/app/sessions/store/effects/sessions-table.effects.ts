import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { switchMap, take, tap } from 'rxjs/operators';

import { LocalStorageService } from '../../../core/local-storage.service';
import { SessionsTableActions } from '../actions';
import { fromSessionsFeature } from '../reducers';
import { SessionsTableSelectors } from '../selectors';

@Injectable()
export class SessionsTableEffects {

  public persistTableState$ = createEffect(() =>
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
                tap(state => LocalStorageService.setItem(fromSessionsFeature.sessionsFeatureKey, 'table', state)),
              ),
          ),
        ),
    { dispatch: false },
  );

  public constructor(
    private readonly actions: Actions,
    private readonly store: Store,
  ) {
  }

}
