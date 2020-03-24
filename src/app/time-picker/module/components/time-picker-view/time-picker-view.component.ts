import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-time-picker-view',
  templateUrl: './time-picker-view.component.html',
  styleUrls: ['./time-picker-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimePickerViewComponent implements OnChanges, AfterViewInit {

  @Input() public dateTime: DateTime = DateTime.local();
  @Output() public dateTimeChange = new EventEmitter<DateTime>();

  @ViewChildren('hoursEl') public hoursElements: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('minutesEl') public minutesElements: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('secondsEl') public secondsElements: QueryList<ElementRef<HTMLElement>>;

  public hours = new Array(24).fill(0).map((ignored, index) => index);
  public minutes = new Array(60).fill(0).map((ignored, index) => index);
  public seconds = this.minutes;

  public ngOnChanges(changes: SimpleChanges): void {
  }

  public ngAfterViewInit(): void {
    this.scrollToCurrentTime();
  }

  public onSelectHour(hour: number): void {
    this.dateTime = this.dateTime.set({ hour });
    this.dateTimeChange.emit(this.dateTime);
  }

  public onSelectMinute(minute: number): void {
    this.dateTime = this.dateTime.set({ minute });
    this.dateTimeChange.emit(this.dateTime);
  }

  public onSelectSecond(second: number): void {
    this.dateTime = this.dateTime.set({ second });
    this.dateTimeChange.emit(this.dateTime);
  }

  private scrollToCurrentTime(): void {
    const scrollOptions: ScrollIntoViewOptions = { block: 'center' };
    if (this.hoursElements) {
      this.hoursElements.toArray()[this.dateTime.hour].nativeElement.scrollIntoView(scrollOptions);
    }
    if (this.minutesElements) {
      this.minutesElements.toArray()[this.dateTime.minute].nativeElement.scrollIntoView(scrollOptions);
    }
    if (this.secondsElements) {
      this.secondsElements.toArray()[this.dateTime.second].nativeElement.scrollIntoView(scrollOptions);
    }
  }
}
