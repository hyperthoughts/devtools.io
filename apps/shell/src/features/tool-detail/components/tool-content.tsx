import type { ToolDefinition, ToolContext } from '@devtools/core';

interface ToolContentProps {
  tool: ToolDefinition;
  ctx: ToolContext;
}

export function ToolContent({ tool, ctx }: ToolContentProps) {
  return (
    <div>
      <tool.Component ctx={ctx} />
    </div>
  );
}
