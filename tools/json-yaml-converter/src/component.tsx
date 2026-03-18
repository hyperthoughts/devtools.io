import { useState, useCallback } from 'react';
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
import { jsonToYaml, yamlToJson } from './utils.ts';
import { ArrowRightLeft, FileUp, Download } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');

  if (savedInput !== undefined && input === '' && savedInput !== '') {
    setInput(savedInput);
  }

  const process = useCallback(
    (text: string, dir = direction) => {
      if (!text) {
        setOutput('');
        setError(null);
        return;
      }
      try {
        if (dir === 'json-to-yaml') {
          setOutput(jsonToYaml(text));
        } else {
          setOutput(yamlToJson(text));
        }
        setError(null);
      } catch (e: any) {
        setError(e.message || String(e));
        setOutput('');
      }
    },
    [direction],
  );

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    process(val);
  };

  const handleSwap = () => {
    const newDir = direction === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml';
    setDirection(newDir);
    const prev = output;
    setInput(prev);
    void ctx.storage.set('input', prev);
    process(prev, newDir);
  };

  const handleSettingsChange = (newDir: 'json-to-yaml' | 'yaml-to-json') => {
    setDirection(newDir);
    process(input, newDir);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.json', '.yaml', '.yml', '*/*'] });
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
      const ext = direction === 'json-to-yaml' ? '.yaml' : '.json';
      const mtype = direction === 'json-to-yaml' ? 'text/yaml' : 'application/json';
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
              <SelectItem value="json-to-yaml">JSON to YAML</SelectItem>
              <SelectItem value="yaml-to-json">YAML to JSON</SelectItem>
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
          label={direction === 'json-to-yaml' ? 'Input JSON' : 'Input YAML'}
          actions={
            <Button variant="ghost" size="sm" onClick={handleOpenFile}>
              <FileUp className="h-4 w-4 mr-2" /> Load File
            </Button>
          }
        >
          <CodeEditor
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            language={direction === 'json-to-yaml' ? 'json' : 'yaml'}
            className="min-h-[400px]"
            placeholder={direction === 'json-to-yaml' ? '{"key": "value"}' : 'key: value'}
          />
        </ToolField>

        <ToolField
          label={direction === 'json-to-yaml' ? 'Output YAML' : 'Output JSON'}
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
          {error ? (
            <div className="min-h-[400px] p-4 text-red-500 bg-red-500/10 font-mono text-sm border rounded-md whitespace-pre-wrap overflow-auto">
              {error}
            </div>
          ) : (
            <CodeEditor
              value={output}
              readOnly
              language={direction === 'json-to-yaml' ? 'yaml' : 'json'}
              className="min-h-[400px]"
            />
          )}
        </ToolField>
      </div>
    </div>
  );
}
