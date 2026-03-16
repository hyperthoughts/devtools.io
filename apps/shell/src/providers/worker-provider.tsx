import { createContext, useContext, type ReactNode } from 'react';
import { WorkerPool } from '@devtools/workers';
import type { WorkerContract } from '@devtools/workers';

interface WorkerContextValue {
  createPool: <T extends WorkerContract>(
    createWorker: () => Worker,
    poolSize?: number,
  ) => WorkerPool<T>;
}

const WorkerContext = createContext<WorkerContextValue | null>(null);

export function WorkerProvider({ children }: { children: ReactNode }) {
  const value: WorkerContextValue = {
    createPool: <T extends WorkerContract>(createWorker: () => Worker, poolSize?: number) =>
      new WorkerPool<T>(createWorker, poolSize),
  };

  return <WorkerContext.Provider value={value}>{children}</WorkerContext.Provider>;
}

export function useWorkerContext(): WorkerContextValue {
  const ctx = useContext(WorkerContext);
  if (!ctx) throw new Error('useWorkerContext must be used within WorkerProvider');
  return ctx;
}
