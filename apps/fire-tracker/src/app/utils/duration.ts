const MS_PER_SEC = 1000;
const MS_PER_MIN = 60 * MS_PER_SEC;
const MS_PER_HOUR = 60 * MS_PER_MIN;

export function formatDuration(durationMs: number): string {
  let remaining = durationMs;
  const hours = Math.trunc(remaining / MS_PER_HOUR);
  remaining = remaining - hours * MS_PER_HOUR;

  const min = Math.trunc(remaining / MS_PER_MIN);
  remaining = remaining - min * MS_PER_MIN;

  const sec = Math.trunc(remaining / MS_PER_SEC);

  return `${formatNum(hours)}:${formatNum(min)}:${formatNum(sec)}`;
}

function formatNum(num: number): string {
  if (num < 10) {
    return `0${num}`;
  }

  return num.toString();
}

export function parseDuration(durationStr: string): number {
  const parseRes = /^ *(?:(\d+)h)?\s*(?:(\d+)m)?\s*$/.exec(durationStr);
  if (!parseRes) {
    return NaN;
  }

  const hours = +parseRes[1];
  const min = +parseRes[2];
  let ms = 0;
  let valid = false;
  if (!isNaN(hours)) {
    ms += hours * MS_PER_HOUR;
    valid = true;
  }

  if (!isNaN(min)) {
    ms += min * MS_PER_SEC;
    valid = true;
  }

  return valid ? ms : NaN;
}
