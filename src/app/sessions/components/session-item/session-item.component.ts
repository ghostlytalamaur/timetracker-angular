import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { getDuration, Session } from '../../models';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Duration } from 'luxon';

@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionItemComponent {

  @HostBinding('class')
  readonly class = 'bg-card bg-hover list-group-item cursor-pointer';

  readonly dateFormat = environment.settings.dateFormat;
  readonly timeFormat = environment.settings.timeFormat;
  duration$: Observable<Duration | null>;
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
        switchMap(s => getDuration(s && s.start ? s.start : null, s ? s.duration : null, environment.settings.durationRate)),
      );
    this.sessionDelete = new EventEmitter<void>();
  }

  onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.sessionDelete.emit();
  }
}
