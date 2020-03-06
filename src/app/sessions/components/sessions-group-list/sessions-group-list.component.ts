import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { SessionsGroup } from '../../models';

@Component({
  selector: 'app-sessions-group-list',
  templateUrl: './sessions-group-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsGroupListComponent {

  @Input()
  public groups: SessionsGroup[];

  public trackById(index: number, group: SessionsGroup): string {
    return group.id;
  }

}
