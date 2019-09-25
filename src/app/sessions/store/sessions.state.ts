import * as fromEntities from './entities';
import * as fromRoot from '../../core/store';
import * as fromSettings from './settings';

export interface SessionsState {
  readonly entities: fromEntities.SessionsEntityState;
  readonly settings: fromSettings.SettingsState;
}

export const sessionsFeatureKey = 'sessions';

export interface State extends fromRoot.State {
  [sessionsFeatureKey]: SessionsState;
}
