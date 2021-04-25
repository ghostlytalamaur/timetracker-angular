import { Pipe, PipeTransform } from '@angular/core';
import { DateTime, DurationUnit } from 'luxon';

@Pipe({
  name: 'ttDateTimeToStartOf',
})
export class TtDateTimeToStartOfPipe implements PipeTransform {
  transform<T extends DateTime | undefined | null>(
    dateTime: T,
    unit: DurationUnit,
  ): T extends DateTime ? DateTime : null {
    return (dateTime ? dateTime.startOf(unit) : null) as T extends DateTime ? DateTime : null;
  }
}

@Pipe({
  name: 'ttDateTimeToEndOf',
})
export class TtDateTimeToEndOfPipe implements PipeTransform {
  transform<T extends DateTime | undefined | null>(
    dateTime: T,
    unit: DurationUnit,
  ): T extends DateTime ? DateTime : null {
    return (dateTime ? dateTime.endOf(unit) : null) as T extends DateTime ? DateTime : null;
  }
}
