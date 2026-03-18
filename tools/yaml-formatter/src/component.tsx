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
    singleQuote: false,
    bracketSpacing: true,
    proseWrap: 'preserve',
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
          void formatYAML(curCode, savedOptions || options);
        }
      }
    }
  }, [savedCode, savedOptions]);

  const updateOptions = (updates: Partial<FormatOptions>) => {
    const next = { ...options, ...updates };
    setOptions(next);
    void ctx.storage.set('options', next);
    if (code) {
      void formatYAML(code, next);
    }
  };

  const formatYAML = async (input: string, opts: FormatOptions) => {
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
    void formatYAML(val, options);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.yml', '.yaml', '*/*'] });
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
      await ctx.filesystem.saveFile(new Blob([formatted], { type: 'text/yaml' }), 'formatted.yml');
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-6 p-4 bg-card border rounded-lg">
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
          <Switch
            checked={options.singleQuote}
            onCheckedChange={(v: boolean) => updateOptions({ singleQuote: v })}
            id="single-quote-yaml"
          />
          <label htmlFor="single-quote-yaml" className="text-sm font-medium cursor-pointer">
            Single Quotes
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={options.bracketSpacing}
            onCheckedChange={(v: boolean) => updateOptions({ bracketSpacing: v })}
            id="bracket-spacing-yaml"
          />
          <label htmlFor="bracket-spacing-yaml" className="text-sm font-medium cursor-pointer">
            Bracket Spacing
          </label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label="Input YAML"
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
            language="yaml"
            className="min-h-[500px]"
            placeholder="key: value"
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
            language="yaml"
            readOnly
            className="min-h-[500px]"
            onChange={() => {}}
          />
        </ToolField>
      </div>
    </div>
  );
}
