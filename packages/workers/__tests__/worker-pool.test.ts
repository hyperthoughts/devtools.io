import { describe, it, expect, vi } from 'vite-plus/test';
import { WorkerPool } from '../src/worker-pool.ts';

function createMockWorker() {
  return {
    postMessage: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    terminate: vi.fn(),
    onmessage: null,
    onmessageerror: null,
    onerror: null,
    dispatchEvent: vi.fn(),
  } as unknown as Worker;
}

describe('WorkerPool', () => {
  it('creates a pool with correct size', () => {
    const pool = new WorkerPool(createMockWorker, 2);
    expect(pool.size).toBe(2);
    expect(pool.activeCount).toBe(0);
  });

  it('throws after termination', async () => {
    const pool = new WorkerPool(createMockWorker, 1);
    pool.terminate();
    await expect(pool.run(async () => 'test')).rejects.toThrow('WorkerPool has been terminated');
  });

  it('tracks pending count', () => {
    const pool = new WorkerPool(createMockWorker, 1);
    expect(pool.pendingCount).toBe(0);
  });
});
