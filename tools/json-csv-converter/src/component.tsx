import { useState, useRef, useEffect } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CodeEditor,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  CopyButton,
} from '@devtools/ui';
import type { WorkerAPI } from './worker.ts';
import { ArrowRightLeft, FileUp, Download, RefreshCw } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const savedInput = ctx.useLive<string>('input');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [direction, setDirection] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv');

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined && savedInput !== '') {
        initialized.current = true;
        setInput(savedInput);
        void processText(savedInput, direction);
      }
    }
  }, [savedInput]);

  const processText = async (text: string, dir: 'json-to-csv' | 'csv-to-json' = direction) => {
    if (!worker || !text.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    setIsProcessing(true);
    try {
      let res = '';
      if (dir === 'json-to-csv') {
        res = await worker.run((api) => api.jsonToCsv(text));
      } else {
        res = await worker.run((api) => api.csvToJson(text));
      }
      setOutput(res);
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
      setOutput('');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    void processText(val, direction);
  };

  const handleSwap = () => {
    const newDir = direction === 'json-to-csv' ? 'csv-to-json' : 'json-to-csv';
    setDirection(newDir);
    const prev = output;
    setInput(prev);
    void ctx.storage.set('input', prev);
    void processText(prev, newDir);
  };

  const handleSettingsChange = (newDir: 'json-to-csv' | 'csv-to-json') => {
    setDirection(newDir);
    void processText(input, newDir);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.json', '.csv', '*/*'] });
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
      const ext = direction === 'json-to-csv' ? '.csv' : '.json';
      const mtype = direction === 'json-to-csv' ? 'text/csv' : 'application/json';
      await ctx.filesystem.saveFile(new Blob([output], { type: mtype }), `converted${ext}`);
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end bg-card p-4 rounded-lg border">
        <ToolField label="Conversion Direction">
          <Select value={direction} onValueChange={(val: any) => handleSettingsChange(val)}>
            <SelectTrigger className="w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json-to-csv">JSON array to CSV</SelectItem>
              <SelectItem value="csv-to-json">CSV to JSON array</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>

        <div className="flex justify-end pb-2">
          <Button variant="outline" size="sm" onClick={handleSwap}>
            <ArrowRightLeft className="h-4 w-4 mr-2" /> Swap
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label={direction === 'json-to-csv' ? 'Input JSON' : 'Input CSV'}
          actions={
            <Button variant="ghost" size="sm" onClick={handleOpenFile}>
              <FileUp className="h-4 w-4 mr-2" /> Load File
            </Button>
          }
        >
          <CodeEditor
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            language={direction === 'json-to-csv' ? 'json' : 'plaintext'}
            className="min-h-[400px]"
            placeholder={
              direction === 'json-to-csv' ? '[\n  {"key": "value"}\n]' : 'key1,key2\nvalue1,value2'
            }
          />
        </ToolField>

        <ToolField
          label={direction === 'json-to-csv' ? 'Output CSV' : 'Output JSON'}
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
            {isProcessing && (
              <div className="absolute top-2 right-2 z-10 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                <RefreshCw className="h-3 w-3 animate-spin" /> Processing...
              </div>
            )}
            {error ? (
              <div className="min-h-[400px] p-4 text-red-500 bg-red-500/10 font-mono text-sm border rounded-md whitespace-pre-wrap overflow-auto">
                {error}
              </div>
            ) : (
              <CodeEditor
                value={output}
                readOnly
                language={direction === 'json-to-csv' ? 'plaintext' : 'json'}
                className="min-h-[400px]"
              />
            )}
          </div>
        </ToolField>
      </div>
    </div>
  );
}
