import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './database.ts';

export function useAppMeta<T>(key: string, fallback: T): T {
  const record = useLiveQuery(() => db.appMeta.get(key), [key]);
  return (record?.value as T) ?? fallback;
}

export async function setAppMeta<T>(key: string, value: T): Promise<void> {
  await db.appMeta.put({ id: key, value });
}

export function useScopedLive<T>(toolId: string, key: string): T | undefined {
  return useLiveQuery(
    () =>
      db.toolStorage
        .where('[toolId+key]')
        .equals([toolId, key])
        .first()
        .then((e) => e?.value as T | undefined),
    [toolId, key],
  );
}

export function useScopedLiveAll(toolId: string): Array<{ key: string; value: unknown }> {
  return (
    useLiveQuery(
      () =>
        db.toolStorage
          .where('toolId')
          .equals(toolId)
          .toArray()
          .then((entries) => entries.map((e) => ({ key: e.key, value: e.value }))),
      [toolId],
    ) ?? []
  );
}
