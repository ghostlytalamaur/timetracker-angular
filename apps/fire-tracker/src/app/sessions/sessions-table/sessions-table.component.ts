import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Session } from '../sessions.store';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'tt-sessions-table',
  templateUrl: './sessions-table.component.html',
  styleUrls: ['./sessions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class SessionsTableComponent {
  @Input()
  sessions = new Array<Session>();
}
