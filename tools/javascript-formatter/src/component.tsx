import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CodeEditor, Button, Switch } from '@devtools/ui';
import type { FormatOptions, WorkerAPI } from './utils.ts';
import { FileUp, Download } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const savedCode = ctx.useLive<string>('code');
  const savedOptions = ctx.useLive<FormatOptions>('options');

  const [code, setCode] = useState('');
  const [formatted, setFormatted] = useState('');

  const [options, setOptions] = useState<FormatOptions>({
    tabWidth: 2,
    singleQuote: true,
    semi: true,
    trailingComma: 'es5',
    parser: 'babel',
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedCode !== undefined && savedOptions !== undefined) {
        initialized.current = true;
        const curCode = savedCode || '';
        setCode(curCode);
        if (savedOptions) setOptions(savedOptions);
        if (curCode) {
          void formatJS(curCode, savedOptions || options);
        }
      }
    }
  }, [savedCode, savedOptions]);

  const updateOptions = (updates: Partial<FormatOptions>) => {
    const next = { ...options, ...updates };
    setOptions(next);
    void ctx.storage.set('options', next);
    if (code) {
      void formatJS(code, next);
    }
  };

  const formatJS = async (input: string, opts: FormatOptions) => {
    if (!input.trim()) {
      setFormatted('');
      return;
    }
    if (!worker) return;
    try {
      const result = await worker.run((api) => api.format(input, opts));
      setFormatted(result);
    } catch {
      // Silently fail on parse error
    }
  };

  const handleCodeChange = (val: string) => {
    setCode(val);
    void ctx.storage.set('code', val);
    void formatJS(val, options);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.js', '.jsx', '.ts', '.tsx', '*/*'] });
      if (file && !Array.isArray(file)) {
        const text = await file.text();
        handleCodeChange(text);
      }
    } catch {
      // User cancelled
    }
  };

  const handleSaveFile = async () => {
    try {
      if (!ctx.filesystem || !formatted) return;
      const ext = options.parser === 'typescript' ? 'ts' : 'js';
      await ctx.filesystem.saveFile(
        new Blob([formatted], { type: 'text/javascript' }),
        `formatted.${ext}`,
      );
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 p-4 bg-card border rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Syntax</label>
          <select
            className="h-8 rounded-md border text-sm px-2 bg-background"
            value={options.parser}
            onChange={(e) => updateOptions({ parser: e.target.value as 'babel' | 'typescript' })}
          >
            <option value="babel">JavaScript / JSX</option>
            <option value="typescript">TypeScript / TSX</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Indent</label>
          <select
            className="h-8 rounded-md border text-sm px-2 w-20 bg-background"
            value={options.tabWidth}
            onChange={(e) => updateOptions({ tabWidth: parseInt(e.target.value, 10) })}
          >
            <option value={2}>2</option>
            <option value={4}>4</option>
            <option value={8}>8</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Trailing Comma</label>
          <select
            className="h-8 rounded-md border text-sm px-2 bg-background"
            value={options.trailingComma}
            onChange={(e) =>
              updateOptions({ trailingComma: e.target.value as 'none' | 'es5' | 'all' })
            }
          >
            <option value="none">None</option>
            <option value="es5">ES5</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={options.singleQuote}
            onCheckedChange={(v: boolean) => updateOptions({ singleQuote: v })}
            id="single-quote-js"
          />
          <label htmlFor="single-quote-js" className="text-sm font-medium cursor-pointer">
            Single Quotes
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={options.semi}
            onCheckedChange={(v: boolean) => updateOptions({ semi: v })}
            id="semi-js"
          />
          <label htmlFor="semi-js" className="text-sm font-medium cursor-pointer">
            Semicolons
          </label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label={`Input ${options.parser === 'typescript' ? 'TypeScript' : 'JavaScript'}`}
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleCodeChange('')}>
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void handleOpenFile()}>
                <FileUp className="h-4 w-4 mr-2" /> Load
              </Button>
            </div>
          }
        >
          <CodeEditor
            value={code}
            onChange={(e: any) => handleCodeChange(e.target.value)}
            language="javascript"
            className="min-h-[500px]"
            placeholder="const hw = () => { console.log('hello world'); }"
          />
        </ToolField>

        <ToolField
          label="Formatted Output"
          actions={
            formatted ? (
              <Button variant="ghost" size="sm" onClick={() => void handleSaveFile()}>
                <Download className="h-4 w-4 mr-2" /> Save Formatted
              </Button>
            ) : undefined
          }
        >
          <CodeEditor
            value={formatted}
            language="javascript"
            readOnly
            className="min-h-[500px]"
            onChange={() => {}}
          />
        </ToolField>
      </div>
    </div>
  );
}
