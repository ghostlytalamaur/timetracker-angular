import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Session } from '../../model/session';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionItemComponent {

  readonly dateFormat = environment.settings.dateFormat;
  readonly timeFormat = environment.settings.timeFormat;

  @Input()
  session: Session;
}
