import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Session } from '../sessions.store';
import { v4 } from 'uuid';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'tt-session-recorder',
  templateUrl: './session-recorder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
  standalone: true,
})
export class SessionRecorderComponent {
  @Input()
  session: Session | undefined;
  @Output()
  readonly startSession = new EventEmitter<Session>();
  @Output()
  readonly sessionChange = new EventEmitter<Update<Session>>();

  protected onToggle(): void {
    if (this.session) {
      this.sessionChange.emit({
        id: this.session.id,
        changes: { durationMs: Date.now() - this.session.start.valueOf() },
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
