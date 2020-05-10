import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable, merge, of } from 'rxjs';
import { catchError, exhaustMap, map, mergeMap } from 'rxjs/operators';

import { SessionsTagsActions } from '../actions';
// noinspection ES6PreferShortImport
import { SessionsTagsStorageService } from '../services';

@Injectable()
export class TagsEffects {

  public loadTags$ = createEffect(() =>
    this.actions
      .pipe(
        ofType(SessionsTagsActions.requestTags),
        exhaustMap(() => this.getChanges()),
      ),
  );

  public addTags$ = createEffect(() =>
    this.actions
      .pipe(
        ofType(SessionsTagsActions.saveTag),
        mergeMap(( { tag }) => this.storage.addTags([tag])),
      ),
    { dispatch: false },
  );

  public deleteTags$ = createEffect(() =>
      this.actions
        .pipe(
          ofType(SessionsTagsActions.deleteTag),
          mergeMap(({ id }) => this.storage.deleteTags([id])),
        ),
    { dispatch: false },
  );

  public constructor(
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
      )

    const tagsModified$ = this.storage.modifiedTags()
      .pipe(
        map(tags => SessionsTagsActions.tagsModified({ tags })),
      )

    return merge(tagsAdded$, tagsDeleted$, tagsModified$)
      .pipe(
        catchError((err) => {
          const message = err instanceof Error ? err.message : JSON.stringify(err);

          return of(SessionsTagsActions.tagsError({ message }));
        }),
      )
  }
}
