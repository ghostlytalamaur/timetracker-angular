import { Injectable } from '@angular/core';
import { getErrorMessage } from '@app/shared/types';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EMPTY, Observable, merge, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap, switchMapTo, takeUntil } from 'rxjs/operators';

import { SessionsTagsActions } from '../actions';
// noinspection ES6PreferShortImport
import { SessionsTagsStorageService } from '../services';

@Injectable()
export class TagsEffects {

  loadTags$ = createEffect(() =>
    this.actions
      .pipe(
        ofType(SessionsTagsActions.requestTags),
        exhaustMap(() => {
          const requested$ = this.actions
            .pipe(
              ofType(SessionsTagsActions.cancelRequestTags),
            );

          return this.getChanges()
            .pipe(
              takeUntil(requested$),
            );
        }),
      ),
  );

  saveTags$ = createEffect(() =>
    this.actions
      .pipe(
        ofType(SessionsTagsActions.saveTag),
        mergeMap(({ tag }) =>
          this.storage.addTags([tag])
            .pipe(
              switchMapTo(EMPTY),
              catchError(err => of(SessionsTagsActions.tagsError({ message: getErrorMessage(err) }))),
            ),
        ),
      ),
  );

  deleteTags$ = createEffect(() =>
    this.actions
      .pipe(
        ofType(SessionsTagsActions.deleteTag),
        mergeMap(({ id }) => this.storage.deleteTags([id])
            .pipe(
              switchMapTo(EMPTY),
              catchError(err => of(SessionsTagsActions.tagsError({ message: getErrorMessage(err) }))),
            )),
      ),
  );

  constructor(
    private readonly actions: Actions,
    private readonly store: Store,
    private readonly storage: SessionsTagsStorageService,
  ) {
  }

  private getChanges(): Observable<Action> {
    const tagsAdded$ = this.storage.addedTags()
      .pipe(
        map(tags => SessionsTagsActions.tagsAdded({ tags })),
      );

    const tagsDeleted$ = this.storage.deletedTags()
      .pipe(
        map(ids => SessionsTagsActions.tagsDeleted({ ids })),
      );

    const tagsModified$ = this.storage.modifiedTags()
      .pipe(
        map(tags => SessionsTagsActions.tagsModified({ tags })),
      );

    return merge(tagsAdded$, tagsDeleted$, tagsModified$)
      .pipe(
        catchError((err) => of(SessionsTagsActions.tagsError({ message: getErrorMessage(err) }))),
      );
  }
}
