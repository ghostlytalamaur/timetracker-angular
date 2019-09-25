import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { SessionEntity } from '../../model/session-entity';

export interface LoadingStatus {
  type: 'loading';
}

export interface ErrorStatus {
  type: 'error';
  message: string;
}

type Status = LoadingStatus | ErrorStatus;

export interface SessionsEntityState extends EntityState<SessionEntity> {
  readonly status: Status | undefined;
  readonly loaded: boolean;
}

export const adapter = createEntityAdapter<SessionEntity>();
