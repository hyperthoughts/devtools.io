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
import type { WorkerAPI, XMLFormatterOptions } from './worker.ts';
import { RefreshCw, FileUp, Download } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const savedOptions = ctx.useLive<XMLFormatterOptions>('options');
  const savedInput = ctx.useLive<string>('input');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);

  const [options, setOptions] = useState<XMLFormatterOptions>({
    indentation: '  ',
    collapseContent: true,
    lineSeparator: '\n',
    whiteSpaceAtEndOfSelfclosingTag: false,
    stripComments: false,
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

  const updateOptions = (updates: Partial<XMLFormatterOptions>) => {
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

  const formatCode = async (code: string, opts: XMLFormatterOptions) => {
    if (!worker || !code.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    setIsFormatting(true);
    try {
      const res = await worker.run((api) => api.formatXml(code, opts));
      setOutput(res);
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
      setOutput('');
    } finally {
      setIsFormatting(false);
    }
  };

  const handleMinify = async () => {
    if (!worker || !input.trim()) return;
    setIsFormatting(true);
    try {
      const res = await worker.run((api) => api.minifyXml(input));
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
      const file = await ctx.filesystem.openFile({ accept: ['.xml', '.ui', '.svg', '*/*'] });
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
        new Blob([output], { type: 'application/xml' }),
        'formatted.xml',
      );
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end bg-card p-4 rounded-lg border">
        <ToolField label="Indentation">
          <Select
            value={options.indentation}
            onValueChange={(val) => updateOptions({ indentation: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="  ">2 Spaces</SelectItem>
              <SelectItem value="    ">4 Spaces</SelectItem>
              <SelectItem value="\t">Tabs</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>

        <div className="flex flex-col gap-3 pb-2 pt-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
            <Switch
              checked={options.collapseContent}
              onCheckedChange={(c) => updateOptions({ collapseContent: c })}
            />
            Collapse Content
          </label>
        </div>

        <div className="flex flex-col gap-3 pb-2 pt-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
            <Switch
              checked={options.whiteSpaceAtEndOfSelfclosingTag}
              onCheckedChange={(c) => updateOptions({ whiteSpaceAtEndOfSelfclosingTag: c })}
            />
            Space in Self-closing
          </label>
        </div>

        <div className="flex flex-col gap-3 pb-2 pt-1">
          <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
            <Switch
              checked={options.stripComments}
              onCheckedChange={(c) => updateOptions({ stripComments: c })}
            />
            Strip Comments
          </label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label="Input XML"
          actions={
            <Button variant="ghost" size="sm" onClick={handleOpenFile}>
              <FileUp className="h-4 w-4 mr-2" /> Load File
            </Button>
          }
        >
          <CodeEditor
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            language="xml"
            className="min-h-[400px]"
            placeholder="Paste XML here..."
          />
        </ToolField>

        <ToolField
          label="Formatted Output"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleMinify} disabled={!input.trim()}>
                Minify
              </Button>
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
              <CodeEditor value={output} readOnly language="xml" className="min-h-[400px]" />
            )}
          </div>
        </ToolField>
      </div>
    </div>
  );
}
