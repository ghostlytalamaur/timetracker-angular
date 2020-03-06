import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Range, withEnd, withStart } from '../../utils';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent {

  @Input()
  public range: Range<Date>;

  @Output()
  public rangeChange: EventEmitter<Range<Date>> = new EventEmitter<Range<Date>>();

  public onSubmit() {
    if (this.range) {
      this.rangeChange.emit(this.range);
    }
  }

  public onStartChange(start: Date) {
    this.range = withStart(this.range, start);
  }

  public onEndChange(end: Date) {
    this.range = withEnd(this.range, end);
  }
}
