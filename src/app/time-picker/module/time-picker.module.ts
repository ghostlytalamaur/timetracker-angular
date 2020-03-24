import { BidiModule } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LuxonModule } from 'luxon-angular';

import { TimePickerComponent, TimePickerContentComponent, TimePickerToggleComponent, TimePickerViewComponent } from './components';
import { DateTimeInputDirective } from './directives';

@NgModule({
  imports: [
    LuxonModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BidiModule,
  ],
  declarations: [
    TimePickerViewComponent,
    TimePickerToggleComponent,
    DateTimeInputDirective,
    TimePickerComponent,
    TimePickerContentComponent,
  ],
  entryComponents: [
    TimePickerContentComponent,
  ],
  exports: [
    TimePickerViewComponent,
    TimePickerToggleComponent,
    DateTimeInputDirective,
    TimePickerComponent,
    TimePickerContentComponent,
  ],
})
export class TimePickerModule {
}
