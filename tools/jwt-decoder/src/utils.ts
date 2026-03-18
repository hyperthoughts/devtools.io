import { jwtDecode } from 'jwt-decode';

export interface DecodedJWT {
  valid: boolean;
  header?: any;
  payload?: any;
  signature?: string;
  error?: string;
}

export function parseJwt(token: string): DecodedJWT {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Empty token' };
  }

  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Invalid JWT format. Expected 3 parts separated by dots.' };
  }

  try {
    const header = jwtDecode(token, { header: true });
    const payload = jwtDecode(token);
    return {
      valid: true,
      header,
      payload,
      signature: parts[2],
    };
  } catch (err: any) {
    return { valid: false, error: err.message || 'Error decoding token' };
  }
}

export function formatTimestamp(ts?: number) {
  if (!ts) return null;
  // JWT standard uses seconds, convert to MS
  const date = new Date(ts * 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  const diffInMs = date.getTime() - Date.now();
  const diffInSeconds = Math.round(diffInMs / 1000);
  let relative = '';

  if (Math.abs(diffInSeconds) < 60) {
    relative = rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInSeconds) < 3600) {
    relative = rtf.format(Math.round(diffInSeconds / 60), 'minute');
  } else if (Math.abs(diffInSeconds) < 86400) {
    relative = rtf.format(Math.round(diffInSeconds / 3600), 'hour');
  } else {
    relative = rtf.format(Math.round(diffInSeconds / 86400), 'day');
  }

  return {
    absolute: date.toLocaleString(),
    relative,
    isExpired: diffInMs < 0,
  };
}
