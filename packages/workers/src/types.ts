export interface WorkerContract {
  [method: string]: (...args: unknown[]) => unknown;
}

export interface TaskDefinition<TInput = unknown, TOutput = unknown> {
  id: string;
  input: TInput;
  execute: (input: TInput) => Promise<TOutput>;
}

export interface TaskResult<TOutput = unknown> {
  id: string;
  output: TOutput;
  duration: number;
}
