import { DatePipe, NgClass, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  Pipe,
  PipeTransform,
} from '@angular/core';
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

interface DayInfo {
  readonly date: Date;
  readonly caption: string;
  readonly isCurMonth: boolean;
  readonly isToday: boolean;
}

function generateDays(base: Date): DayInfo[] {
  const days = new Array<DayInfo>();
  const today = new Date();
  let current = startOfWeek(startOfMonth(base));
  const maxDays = 7 * 5;
  for (let i = 0; i < maxDays; i++) {
    days.push({
      date: current,
      caption: current.getDate().toString(),
      isCurMonth: isSameMonth(current, today),
      isToday: isSameDay(current, today),
    });
    current = addDays(current, 1);
  }

  return days;
}

@Pipe({
  name: 'isSameDay',
  standalone: true,
})
export class SameDayPipe implements PipeTransform {
  transform(value: Date, other: Date) {
    return isSameDay(value, other);
  }
}

@Component({
  selector: 'tt-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgFor, DatePipe, NgClass, SameDayPipe],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: { class: 'block max-w-sm' },
})
export class CalendarComponent {
  @Input()
  set date(value: Date) {
    this._date = value;
    this.activeMonth = value;
    this.days = generateDays(value);
  }
  get date(): Date {
    return this._date;
  }

  @Output()
  readonly dateChange = new EventEmitter<Date>();

  private _date = new Date();
  protected activeMonth = this.date;
  protected days = generateDays(this.activeMonth);
  protected readonly headers = this.days.slice(0, 7).map((day) => ({
    caption: format(day.date, 'E'),
  }));

  protected onSwitchMonth(amount: number): void {
    this.activeMonth = addMonths(this.activeMonth, amount);
    this.days = generateDays(this.activeMonth);
  }

  protected onDateChange(date: Date): void {
    this._date = date;
    this.dateChange.emit(date);
  }
}
