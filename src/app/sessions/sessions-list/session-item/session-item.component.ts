import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { getDuration, Session } from '../../model/session';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionItemComponent {

  readonly dateFormat = environment.settings.dateFormat;
  readonly timeFormat = environment.settings.timeFormat;
  duration$: Observable<number | undefined>;
  private readonly mSession: BehaviorSubject<Session | undefined>;

  @Output()
  sessionDelete: EventEmitter<void>;

  get session(): Session | undefined {
    return this.mSession.value;
  }

  @Input()
  set session(session: Session | undefined) {
    this.mSession.next(session);
  }

  constructor() {
    this.mSession = new BehaviorSubject<Session | undefined>(undefined);
    this.duration$ = this.mSession
      .pipe(
        switchMap(s => getDuration(s && s.start, s && s.end, environment.settings.durationRate))
      );
    this.sessionDelete = new EventEmitter<void>();
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.sessionDelete.emit();
  }
}
