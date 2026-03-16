import { describe, it, expect } from 'vite-plus/test';
import { TaskRunner } from '../src/task-runner.ts';

describe('TaskRunner', () => {
  it('executes a task and returns result', async () => {
    const runner = new TaskRunner();
    const result = await runner.execute('test-task', 42, async (input) => {
      return input * 2;
    });

    expect(result.id).toBe('test-task');
    expect(result.output).toBe(84);
    expect(result.duration).toBeGreaterThanOrEqual(0);
  });

  it('measures execution duration', async () => {
    const runner = new TaskRunner();
    const result = await runner.execute('slow-task', null, async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return 'done';
    });

    expect(result.duration).toBeGreaterThan(0);
  });
});
