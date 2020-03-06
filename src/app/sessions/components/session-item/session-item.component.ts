import { ChangeDetectionStrategy, Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { Duration } from 'luxon';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Session, getDuration } from '../../models';

@Component({
  selector: 'app-session-item',
  templateUrl: './session-item.component.html',
  styleUrls: ['./session-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionItemComponent {

  @HostBinding('class')
  public readonly class = 'bg-card bg-hover list-group-item cursor-pointer';

  public readonly dateFormat = environment.settings.dateFormat;
  public readonly timeFormat = environment.settings.timeFormat;
  public duration$: Observable<Duration | null>;
  private readonly mSession: BehaviorSubject<Session | undefined>;

  @Output()
  public sessionDelete: EventEmitter<void>;

  public get session(): Session | undefined {
    return this.mSession.value;
  }

  @Input()
  public set session(session: Session | undefined) {
    this.mSession.next(session);
  }

  public constructor() {
    this.mSession = new BehaviorSubject<Session | undefined>(undefined);
    this.duration$ = this.mSession
      .pipe(
        switchMap(s => getDuration(s && s.start ? s.start : null, s ? s.duration : null, environment.settings.durationRate)),
      );
    this.sessionDelete = new EventEmitter<void>();
  }

  public onDelete(event: MouseEvent) {
    event.stopPropagation();
    this.sessionDelete.emit();
  }
}
