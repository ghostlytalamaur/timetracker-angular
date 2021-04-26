import { Injectable } from '@angular/core';
import { EventType, ISessionTag } from '@tt/types';
import { merge, Observable } from 'rxjs';
import { initialStatus, LoadableState, LoadableStore } from '@app/core/store';
import { Nullable } from '@tt/utils';
import { ClientService, EventsService } from '@app/core/api';

type ISessionsTagsState = LoadableState<ISessionTag[]>;

@Injectable({
  providedIn: 'root',
})
export class SessionsTagsService extends LoadableStore<ISessionTag[], ISessionsTagsState> {
  constructor(private readonly client: ClientService, private readonly events: EventsService) {
    super({
      data: undefined,
      status: initialStatus(),
    });
  }

  getTags$(): Observable<Nullable<ISessionTag[]>> {
    return this.getData$();
  }

  addTag(label: string): void {
    this.hold(this.client.addSessionTag$({ label }));
  }

  saveTag(tag: ISessionTag): void {
    this.hold(
      this.client.updateSessionTagss$([
        {
          id: tag.id,
          changes: tag,
        },
      ]),
    );
  }

  deleteTag(id: string): void {
    this.hold(this.client.deleteSessionTags$([id]));
  }

  protected loadData$(): Observable<Nullable<ISessionTag[]>> {
    return this.client.getSessionTags$();
  }

  protected invalidate$(): Observable<unknown> {
    return merge(
      this.events.on$(EventType.SessionTagsModified),
      this.events.on$(EventType.SessionTagsDeleted),
    );
  }
}
