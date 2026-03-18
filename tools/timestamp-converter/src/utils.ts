export interface ParsedTimestamp {
  isValid: boolean;
  date: Date | null;
  iso: string;
  utc: string;
  local: string;
  unixSeconds: number;
  unixMilliseconds: number;
  relative: string;
}

export function parseTimestamp(input: string | number): ParsedTimestamp {
  if (input === '' || input === null || input === undefined) {
    return getErrorTimestamp();
  }

  let d: Date;
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (/^-?\d+$/.test(trimmed)) {
      const num = parseInt(trimmed, 10);
      d = new Date(Math.abs(num) > 9999999999 ? num : num * 1000);
    } else {
      d = new Date(trimmed);
    }
  } else {
    d = new Date(Math.abs(input) > 9999999999 ? input : input * 1000);
  }

  const isValid = !isNaN(d.getTime());
  if (!isValid) {
    return getErrorTimestamp();
  }

  return {
    isValid: true,
    date: d,
    iso: d.toISOString(),
    utc: d.toUTCString(),
    local: d.toString(),
    unixSeconds: Math.floor(d.getTime() / 1000),
    unixMilliseconds: d.getTime(),
    relative: getRelativeTime(d),
  };
}

function getErrorTimestamp(): ParsedTimestamp {
  return {
    isValid: false,
    date: null,
    iso: '',
    utc: '',
    local: '',
    unixSeconds: 0,
    unixMilliseconds: 0,
    relative: '',
  };
}

function getRelativeTime(d: Date): string {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diff = (d.getTime() - Date.now()) / 1000;

  const absDiff = Math.abs(diff);
  if (absDiff < 60) return rtf.format(Math.round(diff), 'second');
  if (absDiff < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (absDiff < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (absDiff < 2592000) return rtf.format(Math.round(diff / 86400), 'day');
  if (absDiff < 31536000) return rtf.format(Math.round(diff / 2592000), 'month');
  return rtf.format(Math.round(diff / 31536000), 'year');
}
