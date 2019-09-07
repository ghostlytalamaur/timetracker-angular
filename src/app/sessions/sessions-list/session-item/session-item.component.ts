import { Component, Input } from '@angular/core';
import { Session } from '../../model/session';

@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss']
})
export class SessionItemComponent {

  readonly format = 'EEEE, MMMM d, y h:mm a';

  @Input()
  session: Session;
}
