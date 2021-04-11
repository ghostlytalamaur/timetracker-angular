import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Duration } from 'luxon';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-session-duration',
  template: `
    <ng-container *ngIf="duration && duration.valueOf() > 0; else negativeTemplate">
      <span>{{ duration | durationToFormat: timeFormat }}</span>
    </ng-container>
    <ng-template #negativeTemplate>
      <span class="text-warn">-{{ duration?.negate() | durationToFormat: timeFormat }}</span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDurationComponent {
  @Input()
  duration: Duration | undefined | null;

  readonly timeFormat = environment.settings.durationFormat;
}
