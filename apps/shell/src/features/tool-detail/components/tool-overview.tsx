import { Badge, Button } from '@devtools/ui';
import type { ToolDefinition } from '@devtools/core';

interface ToolOverviewProps {
  tool: ToolDefinition;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function ToolOverview({ tool, isSidebarOpen, onToggleSidebar }: ToolOverviewProps) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{tool.meta.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{tool.meta.description}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="px-2">
            {tool.meta.category}
          </Badge>
          <span className="text-xs text-muted-foreground">v{tool.meta.version}</span>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        title={isSidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        className="hidden lg:flex"
      >
        {isSidebarOpen ? (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M15 3v18" />
            <path d="m8 9 3 3-3 3" />
          </svg>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M15 3v18" />
            <path d="m11 9-3 3 3 3" />
          </svg>
        )}
      </Button>
    </div>
  );
}
