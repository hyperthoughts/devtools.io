import { useEffect, useRef, useMemo } from 'react';
import { WorkerPool } from './worker-pool.ts';
import type { WorkerContract } from './types.ts';

export function useWorker<T extends WorkerContract>(
  createWorker: () => Worker,
  poolSize?: number,
): WorkerPool<T> {
  const poolRef = useRef<WorkerPool<T> | null>(null);

  if (!poolRef.current) {
    poolRef.current = new WorkerPool<T>(createWorker, poolSize);
  }

  useEffect(() => {
    return () => {
      poolRef.current?.terminate();
      poolRef.current = null;
    };
  }, []);

  return poolRef.current;
}

export function useTask() {
  return useMemo(() => {
    return {
      async run<TInput, TOutput>(
        id: string,
        input: TInput,
        executeFn: (input: TInput) => Promise<TOutput>,
      ) {
        const start = performance.now();
        const output = await executeFn(input);
        const duration = performance.now() - start;
        return { id, output, duration };
      },
    };
  }, []);
}
