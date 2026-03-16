import type { ToolDefinition } from '@devtools/core';
import { toolImports } from './tool-imports.generated.ts';

export async function loadTool(toolId: string): Promise<ToolDefinition> {
  const loader = toolImports[toolId];
  if (!loader) throw new Error(`Unknown tool: ${toolId}`);
  const mod = await loader();
  return mod.default;
}
