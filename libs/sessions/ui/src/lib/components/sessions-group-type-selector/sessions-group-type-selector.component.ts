import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Nullable } from '@tt/core/util';
import { SessionsGroupType } from '@tt/sessions/core';

@Component({
  selector: 'tt-sessions-group-type-selector',
  templateUrl: './sessions-group-type-selector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsGroupTypeSelectorComponent {
  @Input()
  groupType: Nullable<SessionsGroupType>;

  @Output()
  groupTypeChange: EventEmitter<SessionsGroupType> = new EventEmitter<SessionsGroupType>();

  readonly groups = [
    { label: 'No grouping', value: 'none' },
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' },
  ];

  onChangeGroupType(group: SessionsGroupType): void {
    this.groupTypeChange.emit(group);
  }
}
