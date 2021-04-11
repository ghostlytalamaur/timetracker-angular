import { Injectable } from '@angular/core';
import { EventsService, ClientService } from '@app/core/services';
import { initialStatus, Nullable, LoadableState, LoadableStore } from '@app/shared/utils';
import { EventType, ISessionTag } from '@timetracker/shared';
import { merge, Observable } from 'rxjs';

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
