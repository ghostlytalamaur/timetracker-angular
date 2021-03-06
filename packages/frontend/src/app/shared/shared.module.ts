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
import { RouterModule } from '@angular/router';
import { LuxonModule } from 'luxon-angular';

import {
  DateRangePickerDialogComponent,
  DateRangePickerDialogDirective,
} from './components/date-range-picker/date-range-picker-dialog.component';
import { DateRangePickerComponent } from './components/date-range-picker/date-range-picker.component';
import { RouterContainerComponent } from './components/router-container/router-container.component';
import { StatusContainerComponent } from './components/status-container/status-container.component';
import { AlertDialogComponent } from './dialogs/alert-dialog.component';
import { ContextMenuTriggerDirective } from './directives/context-menu-trigger.directive';
import { DateTimeInputDirective } from './directives/date-time-input.directive';
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
  MatExpansionModule,
  MatMenuModule,
  MatDividerModule,
  MatTreeModule,
];

@NgModule({
  imports: [...materialModules, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  declarations: [
    AlertDialogComponent,
    DateTimeInputDirective,
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateRangePickerDialogDirective,
    DateTimeToStartOf,
    DateTimeToEndOf,
    ContextMenuTriggerDirective,
    StatusContainerComponent,
    RouterContainerComponent,
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
    DateTimeInputDirective,
    DateRangePickerComponent,
    DateRangePickerDialogComponent,
    DateRangePickerDialogDirective,
    DateTimeToStartOf,
    DateTimeToEndOf,
    ContextMenuTriggerDirective,
    LuxonModule,
    StatusContainerComponent,
    RouterContainerComponent,
  ],
})
export class SharedModule {
}
