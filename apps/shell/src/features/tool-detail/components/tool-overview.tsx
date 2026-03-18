import { Badge } from '@devtools/ui';
import type { ToolDefinition } from '@devtools/core';

interface ToolOverviewProps {
  tool: ToolDefinition;
}

export function ToolOverview({ tool }: ToolOverviewProps) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{tool.meta.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{tool.meta.description}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="px-2">
          {tool.meta.category}
        </Badge>
        <span className="text-xs text-muted-foreground">v{tool.meta.version}</span>
      </div>
    </div>
  );
}
