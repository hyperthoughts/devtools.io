import type { ToolContext } from '../src/index.ts';
import { createMockStorage } from './mock-storage.ts';

export function createMockToolContext(overrides?: Partial<ToolContext>): ToolContext {
  return {
    toolId: 'test-tool',
    storage: createMockStorage(),
    useLive: () => undefined,
    worker: null,
    filesystem: null,
    theme: 'dark',
    ...overrides,
  };
}
