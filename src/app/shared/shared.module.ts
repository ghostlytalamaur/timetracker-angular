import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { DateTimeInputDirective } from './directives/date-time-input.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { LuxonModule } from 'luxon-angular';
import {
  DateRangePickerDialogComponent,
  DateRangePickerDialogDirective
} from './components/date-range-picker/date-range-picker-dialog.component';

const materialModules = [
  ScrollingModule,
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule
];

@NgModule({
  imports: [...materialModules, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    AlertDialogComponent,
    DateTimeInputDirective,
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateRangePickerDialogDirective
  ],
  entryComponents: [AlertDialogComponent, DateRangePickerDialogComponent],
  exports: [
    ...materialModules,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DateTimeInputDirective,
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateRangePickerDialogDirective,
    LuxonModule
  ]
})
export class SharedModule {
}
