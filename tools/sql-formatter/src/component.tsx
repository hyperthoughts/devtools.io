import { useState, useCallback, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolInputOutput,
  ToolField,
  CodeEditor,
  CopyButton,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@devtools/ui';
import { type FormatOptions, DIALECTS, KEYWORD_CASES, INDENTS } from './utils.ts';
import type { WorkerAPI } from './worker.ts';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const savedInput = ctx.useLive<string>('input');
  const savedDialect = ctx.useLive<string>('dialect');
  const savedKeywordCase = ctx.useLive<FormatOptions['keywordCase']>('keywordCase');
  const savedIndent = ctx.useLive<string>('indent');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);

  const [dialect, setDialect] = useState('sql');
  const [keywordCase, setKeywordCase] = useState<FormatOptions['keywordCase']>('upper');
  const [indent, setIndent] = useState('  ');

  // Load state from live storage
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && savedInput !== undefined) {
      initialized.current = true;
      setInput(savedInput || '');
      if (savedDialect) setDialect(savedDialect);
      if (savedKeywordCase) setKeywordCase(savedKeywordCase);
      if (savedIndent) setIndent(savedIndent);
    }
  }, [savedInput, savedDialect, savedKeywordCase, savedIndent]);

  const updateStorage = useCallback(
    (key: string, value: string) => {
      void ctx.storage.set(key, value);
    },
    [ctx.storage],
  );

  const handleFormat = async () => {
    if (!input.trim()) return;
    setIsFormatting(true);
    setError(null);
    try {
      const result = await worker!.run((api: WorkerAPI) =>
        api.formatSql(input, { dialect, keywordCase, indent }),
      );
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during formatting');
    } finally {
      setIsFormatting(false);
    }
  };

  const handleMinify = async () => {
    if (!input.trim()) return;
    setIsFormatting(true);
    setError(null);
    try {
      const result = await worker!.run((api: WorkerAPI) =>
        api.minifySql(input, { dialect, keywordCase, indent }),
      );
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during minifying');
    } finally {
      setIsFormatting(false);
    }
  };

  const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    updateStorage('input', val);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 rounded-lg border bg-card p-4">
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground">Dialect</label>
          <Select
            value={dialect}
            onValueChange={(v) => {
              setDialect(v);
              updateStorage('dialect', v);
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIALECTS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground">Keyword Case</label>
          <Select
            value={keywordCase}
            onValueChange={(v: any) => {
              setKeywordCase(v);
              updateStorage('keywordCase', v);
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KEYWORD_CASES.map((kc) => (
                <SelectItem key={kc.value} value={kc.value}>
                  {kc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground">Indent</label>
          <Select
            value={indent}
            onValueChange={(v) => {
              setIndent(v);
              updateStorage('indent', v);
            }}
          >
            <SelectTrigger className="h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDENTS.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="ml-auto flex items-end gap-2 pt-4">
          <Button
            variant="secondary"
            onClick={handleMinify}
            disabled={isFormatting || !input.trim()}
          >
            Minify
          </Button>
          <Button onClick={handleFormat} disabled={isFormatting || !input.trim()}>
            Format
          </Button>
        </div>
      </div>

      <ToolInputOutput
        input={
          <ToolField label="Input SQL">
            <CodeEditor
              value={input}
              onChange={handleChangeInput}
              placeholder="SELECT * FROM users WHERE age > 18"
              language="sql"
              className="min-h-[400px]"
            />
          </ToolField>
        }
        output={
          <ToolField label="Output" actions={output ? <CopyButton value={output} /> : undefined}>
            <div className="relative">
              <CodeEditor
                value={output}
                readOnly
                language="sql"
                className={`min-h-[400px] ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              />
              {error && (
                <div className="absolute bottom-0 left-0 right-0 max-h-[50%] overflow-auto rounded-b-md border-t border-destructive bg-destructive/10 p-3 text-sm text-destructive backdrop-blur-sm">
                  <div className="font-semibold">Format Error</div>
                  <pre className="mt-1 whitespace-pre-wrap font-mono text-xs">{error}</pre>
                </div>
              )}
            </div>
          </ToolField>
        }
      />
    </div>
  );
}
