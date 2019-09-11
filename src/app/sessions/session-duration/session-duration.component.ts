import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-session-duration',
  template: '<span [ngClass]="getDurationClasses()">{{ duration | timeInterval }}</span>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionDurationComponent {

  @Input()
  duration: number | undefined;

  getDurationClasses(): { [clazz: string]: boolean } {
    const res: { [clazz: string]: boolean } = {};
    if (!this.duration || this.duration < 0) {
      res['text-warn'] = true;
    }
    return res;
  }

}
