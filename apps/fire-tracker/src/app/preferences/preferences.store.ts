import { createActionGroup, createFeature, createReducer, emptyProps, on } from '@ngrx/store';

interface State {
  readonly darkMode: boolean;
}

const defaults: State = {
  darkMode: true,
};

export const preferencesActions = createActionGroup({
  source: 'Preferences',
  events: {
    'Toggle Dark Mode': emptyProps(),
  },
});

export const preferencesFeature = createFeature({
  name: 'preferences',
  reducer: createReducer(
    defaults,
    on(preferencesActions.toggleDarkMode, (state): State => {
      return { ...state, darkMode: !state.darkMode };
    }),
  ),
});
