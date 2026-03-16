import type { ToolDefinition, ToolContext } from '@devtools/core';

interface ToolContentProps {
  tool: ToolDefinition;
  ctx: ToolContext;
}

export function ToolContent({ tool, ctx }: ToolContentProps) {
  return (
    <div className="rounded-lg border bg-card p-1">
      <tool.Component ctx={ctx} />
    </div>
  );
}
