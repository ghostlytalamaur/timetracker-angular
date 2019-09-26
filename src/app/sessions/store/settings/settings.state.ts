import { Range } from '../../../shared/utils';
import { SessionsGroupType } from '../../model/sessions-group';

export type SortType = 'asc' | 'desc';

export interface SettingsState {
  readonly displayRange: Range<number>;
  readonly groupType: SessionsGroupType;
  readonly sortType: SortType;
}

