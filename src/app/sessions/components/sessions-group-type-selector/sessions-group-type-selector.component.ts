import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionsGroupType } from '../../models/sessions-group';

@Component({
  selector: 'app-sessions-group-type-selector',
  templateUrl: './sessions-group-type-selector.component.html',
  styleUrls: ['./sessions-group-type-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsGroupTypeSelectorComponent {

  readonly groups = [
    { label: 'No grouping', value: 'none' },
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
  ];

  @Input()
  groupType: SessionsGroupType;

  @Output()
  groupTypeChange: EventEmitter<SessionsGroupType> = new EventEmitter<SessionsGroupType>();

  onChangeGroupType(group: SessionsGroupType): void {
    this.groupTypeChange.emit(group);
  }

}
