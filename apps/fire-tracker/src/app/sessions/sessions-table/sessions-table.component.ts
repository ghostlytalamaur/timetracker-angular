import { ChangeDetectionStrategy, Component, Input, Pipe, PipeTransform } from '@angular/core';
import { Session } from '../sessions.store';
import { CommonModule } from '@angular/common';
import { formatDuration } from '../../utils/format-duration';

@Pipe({
  name: 'ttSessionDuration',
  standalone: true,
})
export class SessionDurationPipe implements PipeTransform {
  transform(value: Session): string {
    return value.durationMs > 0 ? formatDuration(value.durationMs) : '';
  }
}

@Pipe({
  name: 'ttSessionEnd',
  standalone: true,
})
export class SessionEndPipe implements PipeTransform {
  transform(value: Session): Date {
    return new Date(+value.start + value.durationMs);
  }
}

@Component({
  selector: 'tt-sessions-table',
  templateUrl: './sessions-table.component.html',
  styleUrls: ['./sessions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, SessionDurationPipe, SessionEndPipe],
})
export class SessionsTableComponent {
  @Input()
  sessions = new Array<Session>();
}
