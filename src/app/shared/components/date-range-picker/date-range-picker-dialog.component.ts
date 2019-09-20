import { Component, Directive, EventEmitter, HostListener, Inject, Input, OnDestroy, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Range } from '../../types';
import { DialogsService } from '../../alert-dialog/dialogs.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  template: '<app-date-range-picker [range]="range" (rangeChange)="onRangeChange($event)"></app-date-range-picker>'
})
export class DateRangePickerDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<DateRangePickerDialogComponent, Range<Date>>,
    @Inject(MAT_DIALOG_DATA) public readonly range: Range<Date>
  ) {
  }

  onRangeChange(range: Range<Date>): void {
    this.dialogRef.close(range);
  }
}

@Directive({
  selector: '[appDateRangePicker]'
})
export class DateRangePickerDialogDirective implements OnDestroy {

  @Input('appDateRangePicker')
  range: Range<Date>;
  @Output()
  rangeChange: EventEmitter<Range<Date>> = new EventEmitter<Range<Date>>();
  private alive$: Subject<void> = new Subject<void>();

  constructor(
    private readonly dialogs: DialogsService
  ) {
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }

  @HostListener('click')
  onSelectRange(): void {
    this.dialogs.component<Range<Date>, Range<Date>>(DateRangePickerDialogComponent, this.range)
      .pipe(
        take(1),
        takeUntil(this.alive$)
      )
      .subscribe(
        range => {
          if (range) {
            this.rangeChange.emit(range);
          }
        }
      );
  }
}
