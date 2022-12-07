import { createAction, createFeature, createReducer, on } from '@ngrx/store';

interface State {
  readonly darkMode: boolean;
}

const defaults: State = {
  darkMode: true,
};

export const preferencesActions = {
  toggleDarkMode: createAction('[Preferences] Toggle Dark Mode'),
};

export const preferencesFeature = createFeature({
  name: 'preferences',
  reducer: createReducer(
    defaults,
    on(preferencesActions.toggleDarkMode, (state): State => {
      return { ...state, darkMode: !state.darkMode };
    }),
  ),
});
