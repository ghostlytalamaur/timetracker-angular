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
import { TimeIntervalPipe } from './time-interval.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import { DateTimeInputDirective } from './directives/date-time-input.directive';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  imports: [
    ...materialModules,
    FormsModule,
    CommonModule
  ],
  exports: [
    ...materialModules,
    TimeIntervalPipe,
    DateTimeInputDirective
  ],
  declarations: [TimeIntervalPipe, AlertDialogComponent, DateTimeInputDirective],
  entryComponents: [AlertDialogComponent]
})
export class SharedModule {
}
