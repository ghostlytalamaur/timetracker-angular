import { AnimationTriggerMetadata, animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { DateTime } from 'luxon';
import { Subject } from 'rxjs';

import { TimePickerComponent } from './time-picker.component';

const transformPanel: AnimationTriggerMetadata =
  trigger('transformPanel', [
    state('void', style({
      opacity: 0,
      transform: 'scale(1, 0.8)',
    })),

    transition('void => *', animate('120ms cubic-bezier(0, 0, 0.2, 1)', style({
      opacity: 1,
      transform: 'scale(1, 1)',
    }))),

    transition('* => void', animate('120ms linear', style({
      opacity: 0,
      transform: 'scale(1, 0.8)',
    }))),
  ]);

@Component({
  templateUrl: './time-picker-content.component.html',
  styleUrls: ['./time-picker-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    transformPanel,
  ],
})
export class TimePickerContentComponent implements OnDestroy {

  public timePicker: TimePickerComponent | null = null;
  public animationDone = new Subject<void>();

  @HostBinding('class') public readonly cssClass = 'time-picker-content';
  @HostBinding('@transformPanel') public animationState: 'enter' | 'void' = 'enter';

  public constructor(
    private readonly cd: ChangeDetectorRef,
  ) {
  }

  @HostListener('@transformPanel.done')
  public onAnimationDone(): void {
    this.animationDone.next();
  }

  public startExitAnimation(): void {
    this.animationState = 'void';
    this.cd.markForCheck();
  }

  public ngOnDestroy(): void {
    this.timePicker = null;
    this.animationDone.complete();
  }

  public onChange(dateTime: DateTime) {
    if (this.timePicker) {
      this.timePicker.dateTime = dateTime;
      this.timePicker.dateTimeChange.next(dateTime);
    }
  }

}
