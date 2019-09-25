import { EntitiesActions } from './entities';
import { SettingsActions } from './settings';

export { State, sessionsFeatureKey } from './sessions.state';
export * from './sessions.reducers';
export * from './sessions.selectors';
export const SessionsActions = {
  ...EntitiesActions,
  ...SettingsActions
};
