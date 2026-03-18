import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CodeEditor, Switch } from '@devtools/ui';
import type { RegexMatch, WorkerAPI } from './worker.ts';
import type { RegexOptions } from './utils.ts';
import { RefreshCw, AlertCircle } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const savedOptions = ctx.useLive<RegexOptions>('options');
  const [options, setOptions] = useState<RegexOptions>({
    pattern: '[a-z]+',
    flags: 'gid',
    text: 'Example text to match against regular expressions 123!',
  });
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedOptions !== undefined) {
        initialized.current = true;
        const opts = savedOptions || options;
        setOptions(opts);
        void executeRegex(opts);
      }
    }
  }, [savedOptions]);

  const executeRegex = async (opts: RegexOptions) => {
    if (!worker) return;
    setIsEvaluating(true);
    setError(null);
    try {
      const results = await worker.run((api) =>
        api.executeRegex(opts.pattern, opts.flags, opts.text),
      );
      setMatches(results);
    } catch (err: any) {
      setError(err.message || String(err));
      setMatches([]);
    } finally {
      setIsEvaluating(false);
    }
  };

  const updateOptions = (updates: Partial<RegexOptions>) => {
    const next = { ...options, ...updates };
    setOptions(next);
    void ctx.storage.set('options', next);
    void executeRegex(next);
  };

  const hasFlag = (flag: string) => options.flags.includes(flag);
  const toggleFlag = (flag: string, checked: boolean) => {
    let f = options.flags;
    if (checked && !f.includes(flag)) {
      f += flag;
    } else if (!checked && f.includes(flag)) {
      f = f.replace(flag, '');
    }
    updateOptions({ flags: f });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[1fr_250px] items-start">
        <div className="space-y-4">
          <ToolField label="Regular Expression">
            <div className="flex items-center gap-2 font-mono text-lg bg-input rounded-md border pl-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span className="text-muted-foreground select-none">/</span>
              <input
                value={options.pattern}
                onChange={(e) => updateOptions({ pattern: e.target.value })}
                className="flex h-10 w-full bg-transparent px-1 py-2 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                placeholder="pattern"
              />
              <span className="text-muted-foreground select-none">/</span>
              <input
                value={options.flags}
                onChange={(e) => updateOptions({ flags: e.target.value })}
                className="flex h-10 w-24 bg-transparent px-1 py-2 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 text-emerald-500 font-mono"
                placeholder="flags"
              />
            </div>
          </ToolField>
        </div>

        <div className="rounded-lg border bg-card p-4 space-y-3">
          <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-2">
            Flags
          </h4>
          <FlagSwitch
            label="Global (g)"
            checked={hasFlag('g')}
            onChange={(c) => toggleFlag('g', c)}
          />
          <FlagSwitch
            label="Case Insensitive (i)"
            checked={hasFlag('i')}
            onChange={(c) => toggleFlag('i', c)}
          />
          <FlagSwitch
            label="Multiline (m)"
            checked={hasFlag('m')}
            onChange={(c) => toggleFlag('m', c)}
          />
          <FlagSwitch
            label="Single Line (s)"
            checked={hasFlag('s')}
            onChange={(c) => toggleFlag('s', c)}
          />
          <FlagSwitch
            label="Indices (d)"
            checked={hasFlag('d')}
            onChange={(c) => toggleFlag('d', c)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField label="Test String">
          <CodeEditor
            value={options.text}
            onChange={(e: any) => updateOptions({ text: e.target.value })}
            language="plaintext"
            className="min-h-[300px]"
          />
        </ToolField>

        <ToolField label={`Matches (${matches.length})`}>
          <div className="min-h-[300px] rounded-md border bg-card relative overflow-y-auto">
            {isEvaluating && (
              <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                <RefreshCw className="h-3 w-3 animate-spin" /> Evaluating...
              </div>
            )}

            {error ? (
              <div className="p-4 flex items-start gap-3 text-red-500 bg-red-500/10">
                <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                <p className="font-mono text-sm">{error}</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="flex h-full items-center justify-center p-8 text-center text-muted-foreground">
                <p>No matches found.</p>
              </div>
            ) : (
              <div className="divide-y">
                {matches.map((m, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {i + 1}
                      </span>
                      <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-sm break-all">
                        {m.match === '' ? '<empty match>' : m.match}
                      </span>
                    </div>

                    <div className="pl-9 text-xs text-muted-foreground space-y-1">
                      <p>
                        Index: <span className="font-mono">{m.index}</span>
                      </p>
                      {m.groups.length > 0 && (
                        <div className="mt-2 space-y-1">
                          <p className="font-medium">Capture Groups:</p>
                          {m.groups.map((g, gi) => (
                            <div key={gi} className="flex items-start gap-2">
                              <span className="shrink-0 text-muted-foreground opacity-70">
                                [{gi + 1}]
                              </span>
                              <span className="font-mono text-foreground break-all">
                                {g === undefined ? '<undefined>' : g === '' ? '<empty>' : g}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ToolField>
      </div>
    </div>
  );
}

function FlagSwitch({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (c: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onChange(!checked)}>
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
