import { Injectable } from '@angular/core';
import { Status } from '@app/shared/types';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SessionsTagsActions } from '../actions';
import { SessionTag } from '../models';
import { SessionsTagsSelectors } from '../selectors';


@Injectable({
  providedIn: 'root',
})
export class SessionsTagsService {

  public constructor(
    private readonly store: Store,
  ) {
  }

  public getTags(): Observable<SessionTag[]> {
    return this.store.select(SessionsTagsSelectors.selectSessionsTags);
  }

  public getStatus(): Observable<Status> {
    return this.store.select(SessionsTagsSelectors.selectStatus);
  }

  public requestTags(): void {
    this.store.dispatch(SessionsTagsActions.requestTags());
  }

  public saveTag(tag: SessionTag): void {
    this.store.dispatch(SessionsTagsActions.saveTag({ tag }));
  }

  public deleteTag(id: string): void {
    this.store.dispatch(SessionsTagsActions.deleteTag({ id }));
  }
}
