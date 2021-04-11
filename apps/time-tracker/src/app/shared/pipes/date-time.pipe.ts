import { Pipe, PipeTransform } from '@angular/core';
import { DateTime, DurationUnit } from 'luxon';

@Pipe({
  name: 'appDateTimeToStartOf',
})
export class DateTimeToStartOf implements PipeTransform {
  transform<T extends DateTime | undefined | null>(
    dateTime: T,
    unit: DurationUnit,
  ): T extends DateTime ? DateTime : null {
    return (dateTime ? dateTime.startOf(unit) : null) as T extends DateTime ? DateTime : null;
  }
}

@Pipe({
  name: 'appDateTimeToEndOf',
})
export class DateTimeToEndOf implements PipeTransform {
  transform<T extends DateTime | undefined | null>(
    dateTime: T,
    unit: DurationUnit,
  ): T extends DateTime ? DateTime : null {
    return (dateTime ? dateTime.endOf(unit) : null) as T extends DateTime ? DateTime : null;
  }
}
