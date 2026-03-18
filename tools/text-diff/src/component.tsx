import { useState } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CodeEditor,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  Button,
  cn,
} from '@devtools/ui';
import { computeDiff, type DiffMethod } from './utils.ts';
import { FileUp } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  const [method, setMethod] = useState<DiffMethod>('words');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [viewMode, setViewMode] = useState<'inline' | 'split'>('split');

  const diffResults = computeDiff(oldText, newText, method, ignoreWhitespace, ignoreCase);

  const handleOpenFile = async (isOld: boolean) => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({
        accept: ['.txt', '.js', '.json', '.html', '.css', '.md', '*/*'],
      });
      if (file && !Array.isArray(file)) {
        const text = await file.text();
        if (isOld) {
          setOldText(text);
        } else {
          setNewText(text);
        }
      }
    } catch {
      // User cancelled or failed
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end bg-card p-4 rounded-lg border">
        <ToolField label="Diff Method">
          <Select value={method} onValueChange={(val) => setMethod(val as DiffMethod)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="words">Words</SelectItem>
              <SelectItem value="chars">Characters</SelectItem>
              <SelectItem value="lines">Lines</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="css">CSS</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>

        <ToolField label="View Mode">
          <Select value={viewMode} onValueChange={(val) => setViewMode(val as 'inline' | 'split')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="split">Split (Side-by-side)</SelectItem>
              <SelectItem value="inline">Inline (Unified)</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>

        <div className="flex flex-col gap-3 pb-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={ignoreWhitespace} onCheckedChange={setIgnoreWhitespace} />
            Ignore Whitespace
          </label>
        </div>

        <div className="flex flex-col gap-3 pb-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <Switch checked={ignoreCase} onCheckedChange={setIgnoreCase} />
            Ignore Case
          </label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label="Original Text"
          actions={
            <Button variant="ghost" size="sm" onClick={() => handleOpenFile(true)}>
              <FileUp className="h-4 w-4 mr-2" /> Load File
            </Button>
          }
        >
          <CodeEditor
            value={oldText}
            onChange={(e: any) => setOldText(e.target.value)}
            language="plaintext"
            className="min-h-[200px]"
          />
        </ToolField>
        <ToolField
          label="Modified Text"
          actions={
            <Button variant="ghost" size="sm" onClick={() => handleOpenFile(false)}>
              <FileUp className="h-4 w-4 mr-2" /> Load File
            </Button>
          }
        >
          <CodeEditor
            value={newText}
            onChange={(e: any) => setNewText(e.target.value)}
            language="plaintext"
            className="min-h-[200px]"
          />
        </ToolField>
      </div>

      <ToolField label="Difference">
        {viewMode === 'inline' ? (
          <div className="rounded-md border bg-card p-4 min-h-[300px] overflow-auto font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {diffResults.map((part, i) => (
              <span
                key={i}
                className={cn(
                  part.added && 'bg-green-500/20 text-green-700 dark:text-green-400',
                  part.removed && 'bg-red-500/20 text-red-700 dark:text-red-400',
                )}
              >
                {part.value}
              </span>
            ))}
            {diffResults.length === 0 && (
              <span className="text-muted-foreground">No differences to show.</span>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 rounded-md border bg-card min-h-[300px] overflow-hidden">
            <div className="border-r p-4 overflow-auto font-mono text-sm whitespace-pre-wrap leading-relaxed">
              {diffResults.map((part, i) => {
                if (part.added) return null;
                return (
                  <span
                    key={i}
                    className={cn(part.removed && 'bg-red-500/20 text-red-700 dark:text-red-400')}
                  >
                    {part.value}
                  </span>
                );
              })}
            </div>
            <div className="p-4 overflow-auto font-mono text-sm whitespace-pre-wrap leading-relaxed">
              {diffResults.map((part, i) => {
                if (part.removed) return null;
                return (
                  <span
                    key={i}
                    className={cn(
                      part.added && 'bg-green-500/20 text-green-700 dark:text-green-400',
                    )}
                  >
                    {part.value}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </ToolField>
    </div>
  );
}
