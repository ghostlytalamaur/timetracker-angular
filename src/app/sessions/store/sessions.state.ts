import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { SessionEntity } from '../model/session-entity';
import { Range } from '../../shared/utils';
import * as fromRoot from '../../core/store';
import { SessionsGroupType } from '../model/sessions-group';

export interface LoadingStatus {
  type: 'loading';
}

export interface ErrorStatus {
  type: 'error';
  message: string;
}

type Status = LoadingStatus | ErrorStatus;
export const sessionsFeatureKey = 'sessions';

export interface SessionsState extends EntityState<SessionEntity> {
  displayRange: Range<number>;
  groupType: SessionsGroupType;
  status: Status | undefined;
  loaded: boolean;
}

export interface State extends fromRoot.State {
  [sessionsFeatureKey]: SessionsState;
}

export const adapter = createEntityAdapter<SessionEntity>();
