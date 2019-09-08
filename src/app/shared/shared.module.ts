import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import { TimeIntervalPipe } from './time-interval.pipe';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AlertDialogComponent } from './alert-dialog/alert-dialog.component';

const materialModules = [
  ScrollingModule,
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatDialogModule
];

@NgModule({
  imports: [
    ...materialModules
  ],
  exports: [
    ...materialModules,
    TimeIntervalPipe
  ],
  declarations: [TimeIntervalPipe, AlertDialogComponent],
  entryComponents: [AlertDialogComponent]
})
export class SharedModule {
}
