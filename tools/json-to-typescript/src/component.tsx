import { useState, useCallback } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CodeEditor, Input, Button, CopyButton } from '@devtools/ui';
import { convertJsonToTs } from './utils.ts';
import { FileUp, Download } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const savedRootName = ctx.useLive<string>('rootName');

  const [input, setInput] = useState('');
  const [rootName, setRootName] = useState('RootObject');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (savedInput !== undefined && input === '' && savedInput !== '') {
    setInput(savedInput);
  }
  if (
    savedRootName !== undefined &&
    rootName === 'RootObject' &&
    savedRootName !== 'RootObject' &&
    savedRootName !== ''
  ) {
    setRootName(savedRootName);
  }

  const process = useCallback(
    (text: string, rn = rootName) => {
      if (!text) {
        setOutput('');
        setError(null);
        return;
      }
      try {
        setOutput(convertJsonToTs(text, rn || 'RootObject'));
        setError(null);
      } catch (e: any) {
        setError(e.message || String(e));
        setOutput('');
      }
    },
    [rootName],
  );

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    process(val);
  };

  const handleRootName = (val: string) => {
    setRootName(val);
    void ctx.storage.set('rootName', val);
    process(input, val);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.json', '*/*'] });
      if (file && !Array.isArray(file)) {
        const text = await file.text();
        handleInput(text);
      }
    } catch {
      // User cancelled
    }
  };

  const handleSaveFile = async () => {
    try {
      if (!ctx.filesystem) return;
      await ctx.filesystem.saveFile(
        new Blob([output], { type: 'text/typescript' }),
        'interfaces.ts',
      );
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card p-4 rounded-lg border max-w-sm">
        <ToolField label="Root Interface Name">
          <Input
            value={rootName}
            onChange={(e) => handleRootName(e.target.value)}
            placeholder="RootObject"
          />
        </ToolField>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label="Input JSON"
          actions={
            <Button variant="ghost" size="sm" onClick={handleOpenFile}>
              <FileUp className="h-4 w-4 mr-2" /> Load JSON
            </Button>
          }
        >
          <CodeEditor
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            language="json"
            className="min-h-[400px]"
            placeholder='{"key": "value"}'
          />
        </ToolField>

        <ToolField
          label="TypeScript Interfaces"
          actions={
            <div className="flex items-center gap-2">
              {output && <CopyButton value={output} />}
              {output && (
                <Button variant="ghost" size="sm" onClick={handleSaveFile}>
                  <Download className="h-4 w-4 mr-2" /> Save Formatted API
                </Button>
              )}
            </div>
          }
        >
          {error ? (
            <div className="min-h-[400px] p-4 text-red-500 bg-red-500/10 font-mono text-sm border rounded-md whitespace-pre-wrap overflow-auto">
              {error}
            </div>
          ) : (
            <CodeEditor value={output} readOnly language="typescript" className="min-h-[400px]" />
          )}
        </ToolField>
      </div>
    </div>
  );
}
