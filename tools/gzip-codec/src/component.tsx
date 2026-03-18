import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CopyButton, Button } from '@devtools/ui';
import { compress, decompress, bytesToBase64, base64ToBytes } from './utils.ts';
import { ArrowRightLeft, FileUp, Download } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const savedDirection = ctx.useLive<'compress' | 'decompress'>('direction');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<'compress' | 'decompress'>('compress');
  const [error, setError] = useState<string | null>(null);

  const [rawOutputBytes, setRawOutputBytes] = useState<Uint8Array | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined && savedDirection !== undefined) {
        initialized.current = true;
        const curInput = savedInput || '';
        const curDir = savedDirection || 'compress';
        setInput(curInput);
        setDirection(curDir);
        void process(curInput, curDir);
      }
    }
  }, [savedInput, savedDirection]);

  const process = async (val: string, dir: 'compress' | 'decompress') => {
    setError(null);
    if (!val) {
      setOutput('');
      setRawOutputBytes(null);
      return;
    }
    try {
      if (dir === 'compress') {
        const compressed = await compress(val);
        setRawOutputBytes(compressed);
        setOutput(bytesToBase64(compressed));
      } else {
        const bytes = base64ToBytes(val);
        const decompressed = await decompress(bytes);
        setRawOutputBytes(decompressed);
        setOutput(new TextDecoder().decode(decompressed));
      }
    } catch (e: any) {
      setError(e.message || 'Operation failed. Invalid input format.');
      setOutput('');
      setRawOutputBytes(null);
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    void process(val, direction);
  };

  const handleSwap = () => {
    const newDir = direction === 'compress' ? 'decompress' : 'compress';
    setDirection(newDir);
    void ctx.storage.set('direction', newDir);
    const prev = output;
    setInput(prev);
    void ctx.storage.set('input', prev);
    void process(prev, newDir);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({
        accept: direction === 'compress' ? ['*/*'] : ['.gz', '*/*'],
      });
      if (file && !Array.isArray(file)) {
        if (direction === 'decompress' && file.name.endsWith('.gz')) {
          // If expecting compressed and got a .gz file, read as ArrayBuffer and convert to base64
          const buf = await file.arrayBuffer();
          const base64 = bytesToBase64(new Uint8Array(buf));
          handleInput(base64);
        } else {
          const text = await file.text();
          handleInput(text);
        }
      }
    } catch {
      // User cancelled
    }
  };

  const handleSaveFile = async () => {
    try {
      if (!ctx.filesystem || !rawOutputBytes) return;
      if (direction === 'compress') {
        await ctx.filesystem.saveFile(
          new Blob([rawOutputBytes as any], { type: 'application/gzip' }),
          'compressed.gz',
        );
      } else {
        await ctx.filesystem.saveFile(
          new Blob([rawOutputBytes as any], { type: 'text/plain' }),
          'decompressed.txt',
        );
      }
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
            variant={direction === 'compress' ? 'default' : 'ghost'}
            onClick={() => {
              setDirection('compress');
              void ctx.storage.set('direction', 'compress');
              void process(input, 'compress');
            }}
          >
            Compress
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
            variant={direction === 'decompress' ? 'default' : 'ghost'}
            onClick={() => {
              setDirection('decompress');
              void ctx.storage.set('direction', 'decompress');
              void process(input, 'decompress');
            }}
          >
            Decompress
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded font-medium">{error}</div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label={direction === 'compress' ? 'Raw Text' : 'Gzip Base64'}
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
              direction === 'compress'
                ? 'Enter text to compress...'
                : 'Enter Base64 compressed string...'
            }
          />
        </ToolField>

        <ToolField
          label={direction === 'compress' ? 'Gzip Base64' : 'Raw Text'}
          actions={
            <div className="flex items-center gap-1">
              {output && <CopyButton value={output} />}
              {rawOutputBytes && (
                <Button variant="ghost" size="sm" onClick={() => void handleSaveFile()}>
                  <Download className="h-4 w-4 mr-2" /> Save File
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
              direction === 'compress'
                ? 'Base64 output will appear here...'
                : 'Decompressed output will appear here...'
            }
          />
        </ToolField>
      </div>
    </div>
  );
}
