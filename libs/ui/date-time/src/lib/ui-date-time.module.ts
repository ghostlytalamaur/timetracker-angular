import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './date-range-picker/date-range-picker.component';
import {
  DateRangePickerDialogComponent,
  DateRangePickerDialogDirective,
} from './date-range-picker/date-range-picker-dialog.component';
import { DateTimeInputDirective } from './directives/date-time-input.directive';
import { TtDateTimeToEndOfPipe, TtDateTimeToStartOfPipe } from './pipes/date-time.pipe';
import { LuxonModule } from 'luxon-angular';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  imports: [
    CommonModule,
    LuxonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatButtonModule,
    MatNativeDateModule,
  ],
  declarations: [
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateTimeInputDirective,
    TtDateTimeToStartOfPipe,
    TtDateTimeToEndOfPipe,
    DateRangePickerDialogDirective,
  ],
  exports: [
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateTimeInputDirective,
    TtDateTimeToStartOfPipe,
    TtDateTimeToEndOfPipe,
    DateRangePickerDialogDirective,
    LuxonModule,
  ],
})
export class UiDateTimeModule {}
