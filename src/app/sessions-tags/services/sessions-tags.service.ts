import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { SessionTag } from '../models';
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
}
