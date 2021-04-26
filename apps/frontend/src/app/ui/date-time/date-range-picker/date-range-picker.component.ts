import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Range } from '@app/core/util';

@Component({
  selector: 'tt-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerComponent implements OnChanges {
  @Input()
  range!: Range<Date>;

  @Output()
  rangeChange: EventEmitter<Range<Date>> = new EventEmitter<Range<Date>>();

  readonly rangeGroup = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.range) {
      this.rangeGroup.setValue({
        start: this.range.start,
        end: this.range.end,
      });
    }
  }

  onSubmit() {
    if (this.range) {
      this.rangeChange.emit(this.rangeGroup.value);
    }
  }
}
