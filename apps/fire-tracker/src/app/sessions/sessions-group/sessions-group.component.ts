import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { Session, SessionsGroup } from "../session";
import { Update } from "@ngrx/entity";
import { SessionsTableComponent } from "../sessions-table/sessions-table.component";
import { DatePipe, NgIf } from "@angular/common";
import { PushModule } from "@ngrx/component";
import { DurationPipe, FormatDurationPipe } from "../duration.pipe";

@Component({
  selector: 'tt-sessions-group',
  templateUrl: './sessions-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [SessionsTableComponent, NgIf, DatePipe, PushModule, DurationPipe, FormatDurationPipe],
  host: { class: 'block border border-gray-300 dark:border-gray-800 shadow rounded' },
})
export class SessionsGroupComponent {
  @Input()
  group: SessionsGroup | undefined;
  @Output()
  readonly sessionChange = new EventEmitter<Update<Session>>();
  @Output()
  readonly deleteSession = new EventEmitter<string>();
}
