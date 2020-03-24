import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { LuxonModule } from 'luxon-angular';

import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';
import {
  DateRangePickerComponent,
  DateRangePickerDialogComponent,
  DateRangePickerDialogDirective,
} from './components';
import { ContextMenuTriggerDirective } from './directives/context-menu-trigger.directive';
import { DateTimeToEndOf, DateTimeToStartOf } from './pipes/date-time.pipe';
import { TimePickerModule } from '../time-picker/module/time-picker.module';

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
  MatExpansionModule,
  MatMenuModule,
  MatDividerModule,
  MatTreeModule,
];

@NgModule({
  imports: [...materialModules, CommonModule, FormsModule, ReactiveFormsModule],
  declarations: [
    AlertDialogComponent,
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateRangePickerDialogDirective,
    DateTimeToStartOf,
    DateTimeToEndOf,
    ContextMenuTriggerDirective,
  ],
  entryComponents: [
    AlertDialogComponent,
    DateRangePickerDialogComponent,
  ],
  exports: [
    ...materialModules,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateRangePickerDialogDirective,
    DateTimeToStartOf,
    DateTimeToEndOf,
    ContextMenuTriggerDirective,
    LuxonModule,
    TimePickerModule,
  ],
})
export class SharedModule {
}
