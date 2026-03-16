import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import type { ToolEntry } from '../types.ts';

interface CommandPaletteProps {
  tools: ToolEntry[];
}

export function CommandPalette({ tools }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const filtered = tools.filter(
    (t) =>
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()),
  );

  const selectTool = useCallback(
    (toolId: string) => {
      void navigate(`/tools/${toolId}`);
      setOpen(false);
      setQuery('');
    },
    [navigate],
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={() => setOpen(false)}
        onKeyDown={() => {}}
        role="presentation"
      />
      <div className="relative w-full max-w-lg rounded-xl border bg-popover shadow-lg">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full rounded-t-xl border-b bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <ul className="max-h-[300px] overflow-y-auto p-2">
          {filtered.map((tool) => (
            <li key={tool.id}>
              <button
                type="button"
                onClick={() => selectTool(tool.id)}
                className="flex w-full flex-col rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
              >
                <span className="text-sm font-medium">{tool.name}</span>
                <span className="text-xs text-muted-foreground">{tool.description}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-muted-foreground">No tools found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
