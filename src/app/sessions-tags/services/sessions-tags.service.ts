import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SessionTag } from '../models';
import { SessionsTagsActions } from '../store/ations';
import { SessionsTagsSelectors } from '../store/selectors';

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

  public loadTags(): void {
    this.store.dispatch(SessionsTagsActions.loadTags());
  }

  public saveTag(tag: SessionTag): void {
    this.store.dispatch(SessionsTagsActions.saveTag({ tag }));
  }

  public deleteTag(id: string): void {
    this.store.dispatch(SessionsTagsActions.deleteTag({ id }));
  }
}
