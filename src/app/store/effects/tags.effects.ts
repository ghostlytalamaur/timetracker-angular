import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, mergeMap, switchMap } from 'rxjs/operators';

import { SessionsTagsActions } from '../actions';
import { SessionsTagsStorageService } from '../services';

@Injectable()
export class TagsEffects {

  public loadTags$ = createEffect(() =>
    this.actions
      .pipe(
        ofType(SessionsTagsActions.loadTags),
        switchMap(() => this.storage.addedTags()),
        map(tags => SessionsTagsActions.loadTagsSuccess({ tags })),
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

  public removeTags$ = createEffect(() =>
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
}
