import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import { TimeIntervalPipe } from './time-interval.pipe';

const materialModules = [
  MatSidenavModule,
  MatToolbarModule,
  MatButtonModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule
];

@NgModule({
  imports: [
    ...materialModules
  ],
  exports: [
    ...materialModules,
    TimeIntervalPipe
  ],
  declarations: [TimeIntervalPipe]
})
export class SharedModule {
}
