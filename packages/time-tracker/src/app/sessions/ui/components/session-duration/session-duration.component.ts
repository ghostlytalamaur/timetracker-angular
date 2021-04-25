import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Duration } from 'luxon';
import { ENVIRONMENT, IEnvironment } from '@tt/core/services';

@Component({
  selector: 'tt-session-duration',
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

  readonly timeFormat = this.env.settings.durationFormat;

  public constructor(@Inject(ENVIRONMENT) private readonly env: IEnvironment) {}
}
