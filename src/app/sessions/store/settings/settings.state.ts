import { Range } from '../../../shared/utils';
import { SessionsGroupType } from '../../model/sessions-group';

export interface SettingsState {
  readonly displayRange: Range<number>;
  readonly groupType: SessionsGroupType;
}

