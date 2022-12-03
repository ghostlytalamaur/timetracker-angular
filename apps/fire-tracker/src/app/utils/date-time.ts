import { parse } from 'date-fns';

export function parseTime(base: Date, timeStr: string): Date {
  let result = parse(timeStr, 'H:mm', base);
  if (isNaN(+result)) {
    result = parse(timeStr, 'Hmm', base);
  }

  return result;
}
