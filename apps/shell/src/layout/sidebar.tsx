import { NavLink } from 'react-router';
import type { ToolCategory } from '@devtools/core';
import type { ToolEntry } from '../types.ts';

interface SidebarProps {
  tools: ToolEntry[];
}

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  formatters: 'Formatters',
  encoders: 'Encoders',
  generators: 'Generators',
  analyzers: 'Analyzers',
  converters: 'Converters',
  validators: 'Validators',
  network: 'Network',
  crypto: 'Crypto',
  text: 'Text',
  media: 'Media',
};

export function Sidebar({ tools }: SidebarProps) {
  const grouped = tools.reduce<Record<string, ToolEntry[]>>((acc, tool) => {
    const cat = tool.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat]!.push(tool);
    return acc;
  }, {});

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <NavLink to="/" className="text-lg font-bold tracking-tight">
          DevTools.io
        </NavLink>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {Object.entries(grouped).map(([category, categoryTools]) => (
          <div key={category} className="mb-4">
            <h3 className="mb-1 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[category as ToolCategory] ?? category}
            </h3>
            <ul className="space-y-0.5">
              {categoryTools.map((tool) => (
                <li key={tool.id}>
                  <NavLink
                    to={`/tools/${tool.id}`}
                    className={({ isActive }) =>
                      `block rounded-md px-2 py-1.5 text-sm transition-colors ${
                        isActive
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`
                    }
                  >
                    {tool.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
