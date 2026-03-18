import { useState } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CopyButton, Input } from '@devtools/ui';
import { parseCron } from './utils.ts';

const EXAMPLES = [
  { label: 'Every minute', expr: '* * * * *' },
  { label: 'Every 5 minutes', expr: '*/5 * * * *' },
  { label: 'Every hour', expr: '0 * * * *' },
  { label: 'Every day at midnight', expr: '0 0 * * *' },
  { label: 'Every weekday', expr: '0 0 * * 1-5' },
  { label: 'Every month', expr: '0 0 1 * *' },
];

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const [input, setInput] = useState('');

  if (savedInput !== undefined && input === '') {
    setInput(savedInput || '* * * * *');
  }

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
  };

  const { description, error } = parseCron(input);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <ToolField label="Cron Expression">
            <div className="relative">
              <Input
                value={input}
                onChange={(e) => handleInput(e.target.value)}
                placeholder="* * * * *"
                className={`font-mono text-lg h-14 ${error ? 'border-destructive' : ''}`}
                autoComplete="off"
                spellCheck={false}
              />
              <div className="absolute right-2 top-2">
                <CopyButton value={input} />
              </div>
            </div>
          </ToolField>

          <div className="p-6 rounded-lg border bg-card text-center min-h-[140px] flex items-center justify-center">
            {error ? (
              <p className="text-destructive font-medium">{error}</p>
            ) : (
              <p className="text-2xl font-medium text-foreground">
                {description || 'Enter a valid cron expression'}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Format Reference</h3>
            <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
              <div className="p-2 border rounded bg-muted/50">
                Minute
                <br />
                (0-59)
              </div>
              <div className="p-2 border rounded bg-muted/50">
                Hour
                <br />
                (0-23)
              </div>
              <div className="p-2 border rounded bg-muted/50">
                Day
                <br />
                (1-31)
              </div>
              <div className="p-2 border rounded bg-muted/50">
                Month
                <br />
                (1-12)
              </div>
              <div className="p-2 border rounded bg-muted/50">
                Day of Week
                <br />
                (0-6)
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Supports standard cron characters: <code>*</code> <code>,</code> <code>-</code>{' '}
              <code>/</code>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium">Examples</h3>
          <div className="flex flex-col gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.expr}
                className="flex flex-col items-start p-3 border rounded-md hover:bg-accent text-left transition-colors"
                onClick={() => handleInput(ex.expr)}
              >
                <span className="text-sm font-medium">{ex.label}</span>
                <span className="text-xs font-mono text-muted-foreground mt-1">{ex.expr}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
