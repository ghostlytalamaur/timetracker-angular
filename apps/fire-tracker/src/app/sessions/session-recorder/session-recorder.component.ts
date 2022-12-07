import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Update } from '@ngrx/entity';
import { Session } from '../session';

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
  readonly startSession = new EventEmitter<{ start: Date }>();
  @Output()
  readonly stopSession = new EventEmitter<{ durationMs: number }>();
  @Output()
  readonly sessionChange = new EventEmitter<Update<Session>>();

  protected onToggle(): void {
    if (this.session) {
      this.stopSession.emit({
        durationMs: Date.now() - this.session.start.valueOf(),
      });
    } else {
      this.startSession.emit({
        start: new Date(),
      });
    }
  }
}
