import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeInterval'
})
export class TimeIntervalPipe implements PipeTransform {

  private static msPerSecond = 1000;
  private static msPerMinutes = 60 * TimeIntervalPipe.msPerSecond;
  private static msPerHour = 60 * TimeIntervalPipe.msPerMinutes;

  transform(milliseconds: number): string {
    if (milliseconds) {
      const hours = Math.trunc(milliseconds / TimeIntervalPipe.msPerHour);

      milliseconds = milliseconds % TimeIntervalPipe.msPerHour;
      const min = Math.trunc(milliseconds / TimeIntervalPipe.msPerMinutes);

      milliseconds = milliseconds % TimeIntervalPipe.msPerMinutes;
      const sec = Math.trunc(milliseconds / TimeIntervalPipe.msPerSecond);

      return `${hours} h ${min} min ${sec} sec`;
    }
    return '0';
  }

}
