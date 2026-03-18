import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CodeEditor, Button } from '@devtools/ui';
import { validateJsonSchema, type ValidationResult } from './utils.ts';
import { CheckCircle2, XCircle, FileUp } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedSchema = ctx.useLive<string>('schema');
  const savedData = ctx.useLive<string>('data');

  const [schema, setSchema] = useState('');
  const [data, setData] = useState('');
  const [result, setResult] = useState<ValidationResult | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedSchema !== undefined && savedData !== undefined) {
        initialized.current = true;
        const curSchema = savedSchema || '';
        const curData = savedData || '';
        setSchema(curSchema);
        setData(curData);
        if (curSchema && curData) {
          setResult(validateJsonSchema(curSchema, curData));
        }
      }
    }
  }, [savedSchema, savedData]);

  const handleSchema = (val: string) => {
    setSchema(val);
    void ctx.storage.set('schema', val);
    setResult(validateJsonSchema(val, data));
  };

  const handleData = (val: string) => {
    setData(val);
    void ctx.storage.set('data', val);
    setResult(validateJsonSchema(schema, val));
  };

  const handleOpenFile = async (type: 'schema' | 'data') => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.json', '*/*'] });
      if (file && !Array.isArray(file)) {
        const text = await file.text();
        if (type === 'schema') handleSchema(text);
        else handleData(text);
      }
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label="JSON Schema"
          actions={
            <Button variant="ghost" size="sm" onClick={() => void handleOpenFile('schema')}>
              <FileUp className="h-4 w-4 mr-2" /> Load Schema
            </Button>
          }
        >
          <CodeEditor
            value={schema}
            onChange={(e: any) => handleSchema(e.target.value)}
            language="json"
            className="min-h-[400px]"
            placeholder='{"type": "object", "properties": {}}'
          />
        </ToolField>

        <ToolField
          label="JSON Data"
          actions={
            <Button variant="ghost" size="sm" onClick={() => void handleOpenFile('data')}>
              <FileUp className="h-4 w-4 mr-2" /> Load Data
            </Button>
          }
        >
          <CodeEditor
            value={data}
            onChange={(e: any) => handleData(e.target.value)}
            language="json"
            className="min-h-[400px]"
            placeholder='{"key": "value"}'
          />
        </ToolField>
      </div>

      <ToolField label="Validation Result">
        <div className="min-h-[140px] border rounded-lg p-6 bg-card flex flex-col items-center justify-center text-center">
          {!result ? (
            <p className="text-muted-foreground">Enter schema and data to validate</p>
          ) : result.valid ? (
            <div className="flex flex-col items-center text-green-500">
              <CheckCircle2 className="h-12 w-12 mb-4" />
              <h3 className="text-xl font-medium">Valid JSON</h3>
              <p className="text-sm opacity-80 mt-1">The data matches the schema perfectly.</p>
            </div>
          ) : (
            <div className="flex flex-col w-full text-left">
              <div className="flex flex-col items-center text-destructive mb-6 text-center">
                <XCircle className="h-12 w-12 mb-4" />
                <h3 className="text-xl font-medium">Validation Failed</h3>
                {result.errorString && (
                  <p className="text-sm font-mono mt-2 bg-destructive/10 p-2 rounded">
                    {result.errorString}
                  </p>
                )}
              </div>

              {result.errors.length > 0 && (
                <div className="bg-destructive/5 rounded-md border border-destructive/20 overflow-hidden">
                  <div className="bg-destructive/10 px-4 py-2 font-medium border-b border-destructive/20 text-destructive">
                    Failed Constraints ({result.errors.length})
                  </div>
                  <ul className="divide-y divide-destructive/10">
                    {result.errors.map((err, i) => (
                      <li key={i} className="px-4 py-3 flex flex-col">
                        <span className="font-mono text-xs text-muted-foreground mb-1 bg-background w-fit px-1.5 py-0.5 rounded border">
                          {err.path}
                        </span>
                        <span className="text-sm text-foreground">{err.message}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </ToolField>
    </div>
  );
}
