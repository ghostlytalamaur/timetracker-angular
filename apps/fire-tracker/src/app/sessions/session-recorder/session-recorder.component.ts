import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../sessions.store';
import { v4 } from 'uuid';

@Component({
  selector: 'tt-session-recorder',
  templateUrl: './session-recorder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SessionRecorderComponent {
  @Input()
  session: Session | undefined;
  @Output()
  readonly startSession = new EventEmitter<Session>();
  @Output()
  readonly stopSession = new EventEmitter<{ id: string; durationMs: number }>();

  protected onToggle(): void {
    if (this.session) {
      this.stopSession.emit({
        id: this.session.id,
        durationMs: Date.now() - this.session.start.valueOf(),
      });
    } else {
      this.startSession.emit({
        id: v4(),
        start: new Date(),
        description: '',
        durationMs: -1,
      });
    }
  }
}
