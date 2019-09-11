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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    TimeIntervalPipe,
    AlertDialogComponent,
    DateTimeInputDirective
  ],
  entryComponents: [
    AlertDialogComponent
  ],
  exports: [
    ...materialModules,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TimeIntervalPipe,
    DateTimeInputDirective
  ]
})
export class SharedModule {
}
