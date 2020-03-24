import { Component, ElementRef, Input, ViewChildren } from '@angular/core';

import { TimePickerComponent } from '../time-picker/time-picker.component';

@Component({
  selector: 'app-time-picker-toggle',
  templateUrl: './time-picker-toggle.component.html',
  styleUrls: ['./time-picker-toggle.component.scss'],
})
export class TimePickerToggleComponent {

  // tslint:disable-next-line:no-input-rename
  @Input('for') public viewComponent: TimePickerComponent;

  @ViewChildren('button') public toggleButton: ElementRef<HTMLElement>;

  public onOpen(): void {
    this.viewComponent.open();
  }

}
