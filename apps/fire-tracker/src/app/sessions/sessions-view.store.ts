import { endOfWeek, startOfWeek } from 'date-fns';
import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';
import { DateRange } from '../models/date-range';

interface State {
  readonly range: DateRange;
}

const defaults: State = {
  range: {
    from: startOfWeek(new Date()),
    to: endOfWeek(new Date()),
  },
};

export const sessionsViewActions = {
  changeRange: createAction('[Sessions View] Change Range', props<{ range: DateRange }>()),
};

export const sessionsViewFeature = createFeature({
  name: 'sessionsView',
  reducer: createReducer(
    defaults,
    on(sessionsViewActions.changeRange, (state, { range }): State => {
      return {
        ...state,
        range,
      };
    }),
  ),
});
