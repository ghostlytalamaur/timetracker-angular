import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from "@angular/core";
import { Session } from '../session';
import { DurationPipe, FormatDurationPipe } from "../duration.pipe";
import { PushModule } from "@ngrx/component";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'tt-session-recorder',
  templateUrl: './session-recorder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex gap-2 items-center' },
  standalone: true,
  imports: [DurationPipe, PushModule, FormatDurationPipe, NgIf, FormsModule],
})
export class SessionRecorderComponent implements OnChanges {
  @Input()
  session: Session | undefined;
  @Output()
  readonly startSession = new EventEmitter<{ start: Date, description: string }>();
  @Output()
  readonly stopSession = new EventEmitter<{ durationMs: number }>();
  @Output()
  readonly sessionChange = new EventEmitter<{ description: string }>();

  protected description = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['session']) {
      this.description = this.session?.description ?? '';
    }
  }

  protected onToggle(): void {
    if (this.session) {
      this.stopSession.emit({
        durationMs: Date.now() - this.session.start.valueOf(),
      });
    } else {
      this.startSession.emit({
        start: new Date(),
        description: this.description,
      });
    }
  }

  protected onChangeDescription(): void {
    this.sessionChange.emit({ description: this.description })
  }

  protected onResetDescription(): void {
    this.description = this.session?.description ?? '';
  }
}
