import * as fromEntities from './entities';
import * as fromRoot from '../../core/store';
import * as fromSettings from './settings';

export const settingsKey = 'settings';
export const sessionsFeatureKey = 'sessions';

export interface SessionsState {
  readonly entities: fromEntities.SessionsEntityState;
  readonly [settingsKey]: fromSettings.SettingsState;
}

export interface State extends fromRoot.State {
  [sessionsFeatureKey]: SessionsState;
}
