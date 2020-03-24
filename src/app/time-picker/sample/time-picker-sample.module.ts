import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LuxonModule } from 'luxon-angular';

import { TimePickerModule } from '../module';

import { TimePickerSampleComponent } from './time-picker-sample/time-picker-sample.component';

@NgModule({
  imports: [
    TimePickerModule,
    LuxonModule,
    MatFormFieldModule,
  ],
  declarations: [
    TimePickerSampleComponent,
  ],
  exports: [
    TimePickerSampleComponent,
  ],
})
export class TimePickerSampleModule {
}
