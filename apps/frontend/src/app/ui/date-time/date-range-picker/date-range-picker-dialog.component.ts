import {
  Component,
  Directive,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { Range } from '@app/core/util';
import { DialogsService } from '@app/ui/dialogs';

@Component({
  template:
    '<tt-date-range-picker [range]="range" (rangeChange)="onRangeChange($event)"></tt-date-range-picker>',
})
export class DateRangePickerDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<DateRangePickerDialogComponent, Range<Date>>,
    @Inject(MAT_DIALOG_DATA) readonly range: Range<Date>,
  ) {}

  onRangeChange(range: Range<Date>): void {
    this.dialogRef.close(range);
  }
}

@Directive({
  selector: '[ttDateRangePicker]',
})
export class DateRangePickerDialogDirective implements OnDestroy {
  @Input('ttDateRangePicker')
  range!: Range<Date>;
  @Output()
  rangeChange: EventEmitter<Range<Date>> = new EventEmitter<Range<Date>>();
  private readonly alive$: Subject<void> = new Subject<void>();

  constructor(private readonly dialogs: DialogsService) {}

  @HostListener('click')
  onSelectRange(): void {
    this.dialogs
      .component<Range<Date>, Range<Date>>(DateRangePickerDialogComponent, this.range)
      .pipe(take(1), takeUntil(this.alive$))
      .subscribe((range) => {
        if (range) {
          this.rangeChange.emit(range);
        }
      });
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }
}
