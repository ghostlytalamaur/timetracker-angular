import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateRange } from '../../models/date-range';
import { addWeeks } from 'date-fns';
import { IconComponent } from '../../ui/icon.component';

@Component({
  selector: 'tt-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [DatePipe, IconComponent],
  host: { class: 'inline-flex items-center' },
})
export class DateRangePickerComponent {
  @Input()
  range: DateRange = {
    from: new Date(),
    to: new Date(),
  };

  @Output()
  readonly rangeChange = new EventEmitter<DateRange>();

  protected onRangeChange(amount: number): void {
    this.range = {
      from: addWeeks(this.range.from, amount),
      to: addWeeks(this.range.to, amount),
    };
    this.rangeChange.emit(this.range);
  }
}
