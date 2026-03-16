import * as Comlink from 'comlink';
import type { WorkerContract } from './types.ts';

export class WorkerPool<T extends WorkerContract = WorkerContract> {
  private idle: Comlink.Remote<T>[] = [];
  private busy = new Set<Comlink.Remote<T>>();
  private queue: Array<{
    resolve: (worker: Comlink.Remote<T>) => void;
    reject: (error: Error) => void;
  }> = [];
  private terminated = false;

  constructor(
    private createWorker: () => Worker,
    private poolSize: number = Math.min(navigator.hardwareConcurrency ?? 4, 8),
  ) {
    for (let i = 0; i < poolSize; i++) {
      this.idle.push(Comlink.wrap<T>(this.createWorker()));
    }
  }

  private acquire(): Promise<Comlink.Remote<T>> {
    const worker = this.idle.pop();
    if (worker) {
      this.busy.add(worker);
      return Promise.resolve(worker);
    }

    return new Promise<Comlink.Remote<T>>((resolve, reject) => {
      this.queue.push({ resolve, reject });
    });
  }

  private release(worker: Comlink.Remote<T>): void {
    this.busy.delete(worker);

    const next = this.queue.shift();
    if (next) {
      this.busy.add(worker);
      next.resolve(worker);
    } else {
      this.idle.push(worker);
    }
  }

  async run<R>(fn: (api: Comlink.Remote<T>) => Promise<R>): Promise<R> {
    if (this.terminated) {
      throw new Error('WorkerPool has been terminated');
    }

    const worker = await this.acquire();
    try {
      return await fn(worker);
    } finally {
      this.release(worker);
    }
  }

  get size(): number {
    return this.poolSize;
  }

  get activeCount(): number {
    return this.busy.size;
  }

  get pendingCount(): number {
    return this.queue.length;
  }

  terminate(): void {
    this.terminated = true;
    for (const entry of this.queue) {
      entry.reject(new Error('WorkerPool terminated'));
    }
    this.queue.length = 0;
    this.idle.length = 0;
    this.busy.clear();
  }
}
