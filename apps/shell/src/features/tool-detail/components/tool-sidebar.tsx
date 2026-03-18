import { Badge, Separator } from '@devtools/ui';
import type { ToolDefinition } from '@devtools/core';

interface ToolSidebarProps {
  tool: ToolDefinition;
}

export function ToolSidebar({ tool }: ToolSidebarProps) {
  return (
    <aside className="space-y-5 self-start rounded-lg border p-5 lg:sticky lg:top-24">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </h3>
        <Badge variant="secondary">{tool.meta.category}</Badge>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Version
        </h3>
        <span className="text-sm">{tool.meta.version}</span>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {tool.meta.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Capabilities
        </h3>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <span
              className={
                tool.capabilities.needsStorage ? 'text-green-500' : 'text-muted-foreground/40'
              }
            >
              ●
            </span>
            Storage
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className={
                tool.capabilities.needsWorker ? 'text-green-500' : 'text-muted-foreground/40'
              }
            >
              ●
            </span>
            Worker
          </li>
          <li className="flex items-center gap-1.5">
            <span
              className={
                tool.capabilities.needsFileSystem ? 'text-green-500' : 'text-muted-foreground/40'
              }
            >
              ●
            </span>
            File System
          </li>
        </ul>
      </div>
    </aside>
  );
}
