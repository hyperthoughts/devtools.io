import { loadRegistry } from '@devtools/storage';
import type { ToolRegistryEntry } from '@devtools/storage';
import registryData from './registry.json';

export async function initializeRegistry(): Promise<void> {
  const tools = (registryData.tools ?? []) as ToolRegistryEntry[];
  await loadRegistry(tools);
}
