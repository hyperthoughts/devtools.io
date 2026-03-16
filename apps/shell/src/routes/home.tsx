import { Link } from 'react-router';
import { Card, CardHeader, CardTitle, CardDescription } from '@devtools/ui';
import type { ToolEntry } from '../types.ts';

interface HomeProps {
  tools: ToolEntry[];
}

export function Home({ tools }: HomeProps) {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">DevTools.io</h1>
        <p className="mt-2 text-muted-foreground">
          Private-first developer tools. No accounts, no tracking, no servers.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-xs font-mono">⌘K</kbd> to
          search tools
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link key={tool.id} to={`/tools/${tool.id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-base">{tool.name}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
