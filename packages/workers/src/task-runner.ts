import type { TaskResult } from './types.ts';

export class TaskRunner {
  async execute<TInput, TOutput>(
    id: string,
    input: TInput,
    executeFn: (input: TInput) => Promise<TOutput>,
  ): Promise<TaskResult<TOutput>> {
    const start = performance.now();
    const output = await executeFn(input);
    const duration = performance.now() - start;

    return { id, output, duration };
  }
}
