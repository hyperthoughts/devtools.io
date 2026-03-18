import { Badge, Separator } from '@devtools/ui';
import type { ToolDefinition } from '@devtools/core';
import { CAPABILITIES_DISPLAYS } from '../../../constants/capabilities.ts';

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
        <Badge variant="secondary" className="px-2">
          {tool.meta.category}
        </Badge>
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
            <Badge key={tag} variant="secondary" className="rounded-full text-xs px-2">
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
          {CAPABILITIES_DISPLAYS.map((cap) => (
            <li key={cap.key} className="flex items-center gap-1.5">
              <span
                className={
                  tool.capabilities[cap.key] ? 'text-green-500' : 'text-muted-foreground/40'
                }
              >
                ●
              </span>
              {cap.label}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
