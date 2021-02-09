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

  constructor(
    private readonly store: Store,
  ) {
  }

  getTags(): Observable<SessionTag[]> {
    return this.store.select(SessionsTagsSelectors.selectSessionsTags);
  }

  getStatus(): Observable<Status> {
    return this.store.select(SessionsTagsSelectors.selectStatus);
  }

  requestTags(): void {
    this.store.dispatch(SessionsTagsActions.requestTags());
  }

  cancelRequestTags(): void {
    this.store.dispatch(SessionsTagsActions.cancelRequestTags());
  }

  saveTag(tag: SessionTag): void {
    this.store.dispatch(SessionsTagsActions.saveTag({ tag }));
  }

  deleteTag(id: string): void {
    this.store.dispatch(SessionsTagsActions.deleteTag({ id }));
  }
}
