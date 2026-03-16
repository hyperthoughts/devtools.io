import type { ToolWorkerPool } from '../src/index.ts';

export function createMockWorkerPool(): ToolWorkerPool {
  return {
    async run<R>(fn: (api: unknown) => Promise<R>): Promise<R> {
      return fn({});
    },
    terminate(): void {
      // no-op
    },
  };
}
