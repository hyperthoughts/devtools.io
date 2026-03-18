import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CopyButton,
  Button,
  Switch,
  CodeEditor,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@devtools/ui';
import type { ConversionDirection, ConverterOptions, WorkerAPI } from './utils.ts';
import { ArrowRightLeft, FileUp, Download } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const savedInput = ctx.useLive<string>('input');
  const savedDirection = ctx.useLive<ConversionDirection>('direction');
  const savedOptions = ctx.useLive<ConverterOptions>('options');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [direction, setDirection] = useState<ConversionDirection>('html-to-md');
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<ConverterOptions>({
    gfm: true,
    breaks: false,
    headingStyle: 'atx',
    hr: '* * *',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
    strongDelimiter: '**',
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined && savedDirection !== undefined && savedOptions !== undefined) {
        initialized.current = true;
        const curInput = savedInput || '';
        const curDir = savedDirection || 'html-to-md';
        const curOpts = savedOptions || options;
        setInput(curInput);
        setDirection(curDir);
        setOptions(curOpts);
        void process(curInput, curDir, curOpts);
      }
    }
  }, [savedInput, savedDirection, savedOptions]);

  const process = async (val: string, dir: ConversionDirection, opts: ConverterOptions) => {
    setError(null);
    if (!val.trim()) {
      setOutput('');
      return;
    }
    if (!worker) return;
    try {
      const result = await worker.run((api) => api.convert(val, dir, opts));
      setOutput(result);
    } catch (e: any) {
      setError(e.message || 'Conversion failed. Invalid input format.');
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    void process(val, direction, options);
  };

  const updateOptions = (updates: Partial<ConverterOptions>) => {
    const next = { ...options, ...updates };
    setOptions(next);
    void ctx.storage.set('options', next);
    void process(input, direction, next);
  };

  const handleSwap = () => {
    const newDir = direction === 'html-to-md' ? 'md-to-html' : 'html-to-md';
    setDirection(newDir);
    void ctx.storage.set('direction', newDir);
    const prev = output;
    setInput(prev);
    void ctx.storage.set('input', prev);
    void process(prev, newDir, options);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({
        accept: direction === 'html-to-md' ? ['.html', '.htm', '*/*'] : ['.md', '.markdown', '*/*'],
      });
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
      const ext = direction === 'html-to-md' ? '.md' : '.html';
      const type = direction === 'html-to-md' ? 'text/markdown' : 'text/html';
      await ctx.filesystem.saveFile(new Blob([output], { type }), `converted${ext}`);
    } catch {
      // User cancelled
    }
  };

  const inLang = direction === 'html-to-md' ? 'html' : 'markdown';
  const outLang = direction === 'html-to-md' ? 'markdown' : 'html';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pt-2">
        <div className="bg-card p-2 rounded-lg border inline-flex gap-2 self-start">
          <Button
            variant={direction === 'html-to-md' ? 'default' : 'ghost'}
            onClick={() => {
              setDirection('html-to-md');
              void ctx.storage.set('direction', 'html-to-md');
              void process(input, 'html-to-md', options);
            }}
          >
            HTML to Markdown
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
            variant={direction === 'md-to-html' ? 'default' : 'ghost'}
            onClick={() => {
              setDirection('md-to-html');
              void ctx.storage.set('direction', 'md-to-html');
              void process(input, 'md-to-html', options);
            }}
          >
            Markdown to HTML
          </Button>
        </div>

        <div className="bg-card p-4 rounded-lg border flex flex-wrap gap-4 items-center flex-1 max-w-xl">
          {direction === 'md-to-html' ? (
            <>
              <div className="flex items-center gap-2">
                <Switch
                  checked={options.gfm}
                  onCheckedChange={(v: boolean) => updateOptions({ gfm: v })}
                  id="opt-gfm"
                />
                <label htmlFor="opt-gfm" className="text-sm font-medium cursor-pointer">
                  GitHub Flavored Markdown
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={options.breaks}
                  onCheckedChange={(v: boolean) => updateOptions({ breaks: v })}
                  id="opt-breaks"
                />
                <label htmlFor="opt-breaks" className="text-sm font-medium cursor-pointer">
                  Convert \\n to &lt;br&gt;
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">Heading</label>
                <Select
                  value={options.headingStyle}
                  onValueChange={(v: 'setext' | 'atx') => updateOptions({ headingStyle: v })}
                >
                  <SelectTrigger className="w-24 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="atx">ATX (# H1)</SelectItem>
                    <SelectItem value="setext">Setext (===)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">List</label>
                <Select
                  value={options.bulletListMarker}
                  onValueChange={(v: '-' | '+' | '*') => updateOptions({ bulletListMarker: v })}
                >
                  <SelectTrigger className="w-16 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">-</SelectItem>
                    <SelectItem value="+">+</SelectItem>
                    <SelectItem value="*">*</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">Code</label>
                <Select
                  value={options.codeBlockStyle}
                  onValueChange={(v: 'indented' | 'fenced') => updateOptions({ codeBlockStyle: v })}
                >
                  <SelectTrigger className="w-28 h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fenced">Fenced (```)</SelectItem>
                    <SelectItem value="indented">Indented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label={direction === 'html-to-md' ? 'HTML Input' : 'Markdown Input'}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleInput('')}
                className="text-destructive"
              >
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void handleOpenFile()}>
                <FileUp className="h-4 w-4 mr-2" /> Load
              </Button>
            </div>
          }
        >
          <CodeEditor
            value={input}
            onChange={(val: any) => handleInput(val?.target?.value ?? val)}
            language={inLang}
            className="min-h-[500px]"
          />
        </ToolField>

        <ToolField
          label={direction === 'html-to-md' ? 'Markdown Output' : 'HTML Output'}
          actions={
            <div className="flex items-center gap-1">
              <CopyButton value={output} />
              <Button variant="ghost" size="sm" onClick={() => void handleSaveFile()}>
                <Download className="h-4 w-4 mr-2" /> Save
              </Button>
            </div>
          }
        >
          <div className="relative h-full border rounded-lg overflow-hidden flex flex-col min-h-[500px]">
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm font-medium border-b shrink-0">
                {error}
              </div>
            )}
            <CodeEditor
              value={output}
              readOnly
              language={outLang}
              className="flex-1 min-h-0 border-0"
            />
          </div>
        </ToolField>
      </div>
    </div>
  );
}
