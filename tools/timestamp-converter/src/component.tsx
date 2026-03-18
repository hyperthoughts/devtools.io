import { useState, useEffect } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, Input, CopyButton, Button } from '@devtools/ui';
import { parseTimestamp, type ParsedTimestamp } from './utils.ts';
import { Clock } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const [input, setInput] = useState<string>('');
  const [parsed, setParsed] = useState<ParsedTimestamp | null>(null);

  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEpoch(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (savedInput !== undefined) {
      if (!input && savedInput) {
        setInput(savedInput);
        setParsed(parseTimestamp(savedInput));
      } else if (!savedInput && !input) {
        const nowStr = Date.now().toString();
        setInput(nowStr);
        setParsed(parseTimestamp(nowStr));
      }
    }
  }, [savedInput]);

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    setParsed(parseTimestamp(val));
  };

  const setNow = () => {
    const nowStr = Date.now().toString();
    handleInput(nowStr);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-5 w-5" />
          <span className="font-medium">Current Epoch:</span>
          <span className="font-mono text-foreground font-semibold bg-muted px-2 py-0.5 rounded">
            {currentEpoch}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
        <ToolField label="Timestamp or ISO Date String">
          <Input
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="e.g. 1672531200 or 2023-01-01T00:00:00Z"
            className="font-mono text-lg py-6"
          />
        </ToolField>
        <Button onClick={setNow} variant="outline" className="h-14">
          Set to Now
        </Button>
      </div>

      {parsed ? (
        parsed.isValid ? (
          <div className="rounded-lg border bg-card divide-y">
            <ResultRow label="Local Time" value={parsed.local} />
            <ResultRow label="ISO 8601" value={parsed.iso} />
            <ResultRow label="UTC Time" value={parsed.utc} />
            <ResultRow label="Relative" value={parsed.relative} />
            <ResultRow label="Unix (Seconds)" value={parsed.unixSeconds.toString()} />
            <ResultRow label="Unix (Milliseconds)" value={parsed.unixMilliseconds.toString()} />
          </div>
        ) : (
          <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
            Invalid timestamp or date format. Please try entering a valid Unix epoch (seconds or ms)
            or ISO string.
          </div>
        )
      ) : null}
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4 hover:bg-muted/50 transition-colors">
      <span className="font-medium text-muted-foreground min-w-[160px]">{label}</span>
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="font-mono flex-1 truncate text-right sm:text-left">{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
