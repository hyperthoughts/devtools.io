import { Outlet } from 'react-router';
import { Sidebar } from './sidebar.tsx';
import { CommandPalette } from './command-palette.tsx';
import type { ToolEntry } from '../types.ts';

interface ShellLayoutProps {
  tools: ToolEntry[];
}

export function ShellLayout({ tools }: ShellLayoutProps) {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar tools={tools} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
      <CommandPalette tools={tools} />
    </div>
  );
}
