import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CopyButton, Button } from '@devtools/ui';
import { escapeString, unescapeString } from './utils.ts';
import { ArrowRightLeft, FileUp, Download } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const savedDirection = ctx.useLive<'escape' | 'unescape'>('direction');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'escape' | 'unescape'>('escape');

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined && savedDirection !== undefined) {
        initialized.current = true;
        const curInput = savedInput || '';
        const curDir = savedDirection || 'escape';
        setInput(curInput);
        setDirection(curDir);
        process(curInput, curDir);
      }
    }
  }, [savedInput, savedDirection]);

  const process = (val: string, dir: 'escape' | 'unescape') => {
    if (dir === 'escape') setOutput(escapeString(val));
    else setOutput(unescapeString(val));
  };

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    process(val, direction);
  };

  const handleSwap = () => {
    const newDir = direction === 'escape' ? 'unescape' : 'escape';
    setDirection(newDir);
    void ctx.storage.set('direction', newDir);
    const prev = output;
    setInput(prev);
    void ctx.storage.set('input', prev);
    process(prev, newDir);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.txt', '*/*'] });
      if (file && !Array.isArray(file)) {
        const text = await file.text();
        handleInput(text);
      }
    } catch {
      // User cancelled
    }
  };

  const handleSaveFile = async (data: string) => {
    try {
      if (!ctx.filesystem) return;
      await ctx.filesystem.saveFile(new Blob([data], { type: 'text/plain' }), 'escaped-string.txt');
    } catch {
      // User cancelled
    }
  };

  const textareaClass =
    'flex w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[500px] resize-y font-mono';

  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-6">
        <div className="bg-card p-2 rounded-lg border inline-flex gap-2">
          <Button
            variant={direction === 'escape' ? 'default' : 'ghost'}
            onClick={() => {
              setDirection('escape');
              void ctx.storage.set('direction', 'escape');
              process(input, 'escape');
            }}
          >
            Escape
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            className="rounded-full"
            title="Swap"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
          <Button
            variant={direction === 'unescape' ? 'default' : 'ghost'}
            onClick={() => {
              setDirection('unescape');
              void ctx.storage.set('direction', 'unescape');
              process(input, 'unescape');
            }}
          >
            Unescape
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label={direction === 'escape' ? 'Raw Text' : 'Escaped String'}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleInput('')}>
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void handleOpenFile()}>
                <FileUp className="h-4 w-4 mr-2" /> Load
              </Button>
            </div>
          }
        >
          <textarea
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            className={`${textareaClass} bg-card`}
            placeholder={
              direction === 'escape' ? 'Line 1\nLine 2\n"Quotes"' : 'Line 1\\nLine 2\\n\\"Quotes\\"'
            }
          />
        </ToolField>

        <ToolField
          label={direction === 'escape' ? 'Escaped String' : 'Raw Text'}
          actions={
            <div className="flex items-center gap-1">
              {output && <CopyButton value={output} />}
              {output && (
                <Button variant="ghost" size="sm" onClick={() => void handleSaveFile(output)}>
                  <Download className="h-4 w-4 mr-2" /> Save
                </Button>
              )}
            </div>
          }
        >
          <textarea
            readOnly
            value={output}
            className={`${textareaClass} bg-muted/50`}
            placeholder={
              direction === 'escape' ? 'Line 1\\nLine 2\\n\\"Quotes\\"' : 'Line 1\nLine 2\n"Quotes"'
            }
          />
        </ToolField>
      </div>
    </div>
  );
}
