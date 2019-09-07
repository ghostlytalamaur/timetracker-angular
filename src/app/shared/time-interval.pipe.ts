import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeInterval'
})
export class TimeIntervalPipe implements PipeTransform {

  private static msPerHour = 60 * 60 * 1000;
  private static msPerMinutes = 60 * 1000;
  private static msPerSecond = 1000;

  transform(milliseconds: number): string {
    if (milliseconds > 0) {
      const hours = (milliseconds / TimeIntervalPipe.msPerHour).toFixed();

      milliseconds = milliseconds % TimeIntervalPipe.msPerHour;
      const min = (milliseconds / TimeIntervalPipe.msPerMinutes).toFixed();

      milliseconds = milliseconds % TimeIntervalPipe.msPerMinutes;
      const sec = (milliseconds / TimeIntervalPipe.msPerSecond).toFixed();

      return `${hours} h ${min} min ${sec} sec`;
    }
    return '0';
  }

}
