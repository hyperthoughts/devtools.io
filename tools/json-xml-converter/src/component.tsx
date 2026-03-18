import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CopyButton, Button, Switch, CodeEditor } from '@devtools/ui';
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
  const [direction, setDirection] = useState<ConversionDirection>('json-to-xml');
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<ConverterOptions>({
    spaces: 2,
    compact: true,
    ignoreDeclaration: false,
    ignoreAttributes: false,
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined && savedDirection !== undefined && savedOptions !== undefined) {
        initialized.current = true;
        const curInput = savedInput || '';
        const curDir = savedDirection || 'json-to-xml';
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
      // Do not clear output on typed error unless empty string, keep last valid state.
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
    const newDir = direction === 'json-to-xml' ? 'xml-to-json' : 'json-to-xml';
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
        accept: direction === 'json-to-xml' ? ['.json', '*/*'] : ['.xml', '*/*'],
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
      const ext = direction === 'json-to-xml' ? '.xml' : '.json';
      const type = direction === 'json-to-xml' ? 'application/xml' : 'application/json';
      await ctx.filesystem.saveFile(new Blob([output], { type }), `converted${ext}`);
    } catch {
      // User cancelled
    }
  };

  const inLang = direction === 'json-to-xml' ? 'json' : 'xml';
  const outLang = direction === 'json-to-xml' ? 'xml' : 'json';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pt-2">
        <div className="bg-card p-2 rounded-lg border inline-flex gap-2 self-start">
          <Button
            variant={direction === 'json-to-xml' ? 'default' : 'ghost'}
            onClick={() => {
              setDirection('json-to-xml');
              void ctx.storage.set('direction', 'json-to-xml');
              void process(input, 'json-to-xml', options);
            }}
          >
            JSON to XML
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
            variant={direction === 'xml-to-json' ? 'default' : 'ghost'}
            onClick={() => {
              setDirection('xml-to-json');
              void ctx.storage.set('direction', 'xml-to-json');
              void process(input, 'xml-to-json', options);
            }}
          >
            XML to JSON
          </Button>
        </div>

        <div className="bg-card p-4 rounded-lg border flex flex-wrap gap-6 items-center flex-1 max-w-lg">
          <div className="flex items-center gap-2">
            <Switch
              checked={options.compact}
              onCheckedChange={(v: boolean) => updateOptions({ compact: v })}
              id="opt-compact"
            />
            <label htmlFor="opt-compact" className="text-sm font-medium cursor-pointer">
              Compact Elements
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={options.ignoreDeclaration}
              onCheckedChange={(v: boolean) => updateOptions({ ignoreDeclaration: v })}
              id="opt-decl"
            />
            <label htmlFor="opt-decl" className="text-sm font-medium cursor-pointer">
              Ignore XML Decl
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={options.ignoreAttributes}
              onCheckedChange={(v: boolean) => updateOptions({ ignoreAttributes: v })}
              id="opt-attr"
            />
            <label htmlFor="opt-attr" className="text-sm font-medium cursor-pointer">
              Ignore Attributes
            </label>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label={direction === 'json-to-xml' ? 'JSON Input' : 'XML Input'}
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
          label={direction === 'json-to-xml' ? 'XML Output' : 'JSON Output'}
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
