import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, Button } from '@devtools/ui';
import { computeStats, formatBytes } from './utils.ts';
import { FileUp, Trash2 } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const [input, setInput] = useState('');

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined && savedInput !== '') {
        initialized.current = true;
        setInput(savedInput);
      }
    }
  }, [savedInput]);

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.txt', '.md', '.json', '*/*'] });
      if (file && !Array.isArray(file)) {
        const text = await file.text();
        handleInput(text);
      }
    } catch {
      // User cancelled
    }
  };

  const stats = computeStats(input);
  const textareaClass =
    'flex w-full rounded-md border border-input bg-card px-3 py-2 shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-base p-4';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <StatCard label="Words" value={stats.words} />
        <StatCard label="Characters" value={stats.characters} />
        <StatCard label="No Spaces" value={stats.charactersNoSpaces} />
        <StatCard label="Lines" value={stats.lines} />
        <StatCard label="Paragraphs" value={stats.paragraphs} />
        <StatCard label="Size" value={formatBytes(stats.bytes)} />
        <StatCard label="Reading Time" value={`${stats.readingTimeMin} min`} />
      </div>

      <ToolField
        label="Input Text"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleInput('')}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Clear
            </Button>
            <Button variant="ghost" size="sm" onClick={() => void handleOpenFile()}>
              <FileUp className="h-4 w-4 mr-2" /> Load File
            </Button>
          </div>
        }
      >
        <textarea
          value={input}
          onChange={(e: any) => handleInput(e.target.value)}
          className={`${textareaClass} min-h-[400px] max-h-[700px] resize-y`}
          placeholder="Enter or paste text here to see statistics..."
        />
      </ToolField>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-card border rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">{label}</span>
      <span className="text-2xl font-bold mt-1 tracking-tight text-foreground">{value}</span>
    </div>
  );
}
