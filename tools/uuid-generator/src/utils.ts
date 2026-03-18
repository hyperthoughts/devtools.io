import { uuidv7 } from 'uuidv7';
import { ulid, decodeTime as decodeUlidTime } from 'ulidx';

export type IdType = 'uuid-v4' | 'uuid-v7' | 'ulid';

export interface GeneratedId {
  value: string;
  timestamp?: number;
}

export function extractV7Timestamp(uuid: string): number {
  const parts = uuid.split('-');
  const hex = parts[0] + parts[1];
  return parseInt(hex, 16);
}

export function generateIds(type: IdType, count: number): GeneratedId[] {
  const results: GeneratedId[] = [];
  const safeCount = Math.min(Math.max(1, count), 10000); // Cap at 10,000 to prevent locking the browser

  for (let i = 0; i < safeCount; i++) {
    if (type === 'uuid-v4') {
      results.push({ value: crypto.randomUUID() });
    } else if (type === 'uuid-v7') {
      const val = uuidv7();
      results.push({ value: val, timestamp: extractV7Timestamp(val) });
    } else if (type === 'ulid') {
      const val = ulid();
      results.push({ value: val, timestamp: decodeUlidTime(val) });
    }
  }

  return results;
}
