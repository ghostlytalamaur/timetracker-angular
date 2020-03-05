import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
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
import { DateTimeToEndOf, DateTimeToStartOf } from './pipes/date-time.pipe';

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
  MatNativeDateModule,
  MatSelectModule,
  MatExpansionModule
];

@NgModule({
  imports: [...materialModules, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    AlertDialogComponent,
    DateTimeInputDirective,
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateRangePickerDialogDirective,
    DateTimeToStartOf,
    DateTimeToEndOf
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
    DateTimeToStartOf,
    DateTimeToEndOf,
    LuxonModule
  ]
})
export class SharedModule {
}
