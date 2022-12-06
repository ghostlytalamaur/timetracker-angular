import { Pipe, PipeTransform } from "@angular/core";
import { coerceArray } from "@angular/cdk/coercion";
import { getDuration, isActive, Session } from "./session";
import { interval, map, Observable, of, startWith } from "rxjs";
import { formatDuration } from "../utils/duration";

@Pipe({
  name: 'duration',
  standalone: true,
})
export class DurationPipe implements PipeTransform {
  transform(value: Session | ReadonlyArray<Session>): Observable<number> {
    const list = coerceArray(value);
    const hasActive = list.some(isActive);
    if (hasActive) {
      return interval(1000).pipe(
        startWith(undefined),
        map(() => calculateDuration(list)),
      );
    }

    return of(calculateDuration(list));
  }
}

@Pipe({
  name: 'formatDuration',
  standalone: true,
})
export class FormatDurationPipe implements PipeTransform {
  transform(durationMs: number | undefined): string {
    return typeof durationMs === 'number' ? formatDuration(durationMs) : '';
  }
}

function calculateDuration(sessions: ReadonlyArray<Session>): number {
  return sessions.reduce((sum, session) => {
    return sum + getDuration(session);
  }, 0);
}
