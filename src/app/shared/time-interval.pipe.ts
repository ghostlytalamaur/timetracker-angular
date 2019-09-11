import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeInterval'
})
export class TimeIntervalPipe implements PipeTransform {

  private static msPerSecond = 1000;
  private static msPerMinutes = 60 * TimeIntervalPipe.msPerSecond;
  private static msPerHour = 60 * TimeIntervalPipe.msPerMinutes;

  transform(milliseconds: number | undefined | null): string {
    if (typeof milliseconds !== 'number') {
      return '--:--:--';
    }

    const sign = milliseconds < 0 ? '-' : '';
    milliseconds = Math.abs(milliseconds);
    const hours = Math.trunc(milliseconds / TimeIntervalPipe.msPerHour);

    milliseconds = milliseconds % TimeIntervalPipe.msPerHour;
    const min = Math.trunc(milliseconds / TimeIntervalPipe.msPerMinutes).toString().padStart(2, '0');

    milliseconds = milliseconds % TimeIntervalPipe.msPerMinutes;
    const sec = Math.trunc(milliseconds / TimeIntervalPipe.msPerSecond).toString().padStart(2, '0');

    return `${sign}${hours}:${min}:${sec}`;
  }

}
