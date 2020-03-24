import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-time-picker-sample',
  templateUrl: './time-picker-sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerSampleComponent {
  private mDateTime = DateTime.local();

  public timeFormat = 'HH:mm:ss';

  public get dateTime(): DateTime {
    return this.mDateTime;
  };

  public set dateTime(value: DateTime) {
    this.mDateTime = value;
    this.jsDateTime = value.toJSDate();
  }

  public jsDateTime = this.dateTime.toJSDate();
}
