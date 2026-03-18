import { useState, useEffect, useRef } from 'react';
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
  CopyButton,
} from '@devtools/ui';
import type { WorkerAPI, HTMLFormatterOptions } from './worker.ts';
import { RefreshCw, FileUp, Download } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const savedOptions = ctx.useLive<HTMLFormatterOptions>('options');
  const savedInput = ctx.useLive<string>('input');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);

  const [options, setOptions] = useState<HTMLFormatterOptions>({
    printWidth: 80,
    tabWidth: 2,
    useTabs: false,
    bracketSameLine: false,
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedOptions !== undefined && savedInput !== undefined) {
        initialized.current = true;
        const opts = savedOptions || options;
        setOptions(opts);
        setInput(savedInput || '');
        if (savedInput) {
          void formatCode(savedInput, opts);
        }
      }
    }
  }, [savedOptions, savedInput]);

  const updateOptions = (updates: Partial<HTMLFormatterOptions>) => {
    const next = { ...options, ...updates };
    setOptions(next);
    void ctx.storage.set('options', next);
    void formatCode(input, next);
  };

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    void formatCode(val, options);
  };

  const formatCode = async (code: string, opts: HTMLFormatterOptions) => {
    if (!worker || !code.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    setIsFormatting(true);
    try {
      const res = await worker.run((api) => api.formatHtml(code, opts));
      setOutput(res);
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
      setOutput('');
    } finally {
      setIsFormatting(false);
    }
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.html', '.htm', '*/*'] });
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
      await ctx.filesystem.saveFile(new Blob([output], { type: 'text/html' }), 'formatted.html');
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end bg-card p-4 rounded-lg border">
        <ToolField label="Print Width">
          <Select
            value={String(options.printWidth)}
            onValueChange={(val) => updateOptions({ printWidth: parseInt(val, 10) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">60</SelectItem>
              <SelectItem value="80">80</SelectItem>
              <SelectItem value="100">100</SelectItem>
              <SelectItem value="120">120</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>

        <ToolField label="Tab Width">
          <Select
            value={String(options.tabWidth)}
            onValueChange={(val) => updateOptions({ tabWidth: parseInt(val, 10) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">2 Spaces</SelectItem>
              <SelectItem value="4">4 Spaces</SelectItem>
              <SelectItem value="8">8 Spaces</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>

        <div className="flex flex-col gap-3 pb-2 pt-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
            <Switch
              checked={options.useTabs}
              onCheckedChange={(c) => updateOptions({ useTabs: c })}
            />
            Use Tabs
          </label>
        </div>

        <div className="flex flex-col gap-3 pb-2 pt-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
            <Switch
              checked={options.bracketSameLine}
              onCheckedChange={(c) => updateOptions({ bracketSameLine: c })}
            />
            Bracket on Same Line
          </label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label="Input HTML"
          actions={
            <Button variant="ghost" size="sm" onClick={handleOpenFile}>
              <FileUp className="h-4 w-4 mr-2" /> Load File
            </Button>
          }
        >
          <CodeEditor
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            language="html"
            className="min-h-[400px]"
            placeholder="Paste HTML here..."
          />
        </ToolField>

        <ToolField
          label="Formatted HTML"
          actions={
            <div className="flex items-center gap-2">
              {output && <CopyButton value={output} />}
              {output && (
                <Button variant="ghost" size="sm" onClick={handleSaveFile}>
                  <Download className="h-4 w-4 mr-2" /> Save
                </Button>
              )}
            </div>
          }
        >
          <div className="relative min-h-[400px]">
            {isFormatting && (
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                <RefreshCw className="h-3 w-3 animate-spin" /> Formatting...
              </div>
            )}
            {error ? (
              <div className="h-[400px] p-4 text-red-500 bg-red-500/10 font-mono text-sm border rounded-md whitespace-pre-wrap overflow-auto">
                {error}
              </div>
            ) : (
              <CodeEditor value={output} readOnly language="html" className="min-h-[400px]" />
            )}
          </div>
        </ToolField>
      </div>
    </div>
  );
}
