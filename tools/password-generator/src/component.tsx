import { useState, useCallback, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CodeEditor,
  CopyButton,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Switch,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@devtools/ui';
import {
  generateRandomPassword,
  generatePassphrase,
  type PasswordMode,
  type RandomOptions,
  type PassphraseOptions,
} from './utils.ts';
import type { WorkerAPI } from './worker.ts';
import { RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const [mode, setMode] = useState<PasswordMode>('random');
  const [randomOpts, setRandomOpts] = useState<RandomOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [passphraseOpts, setPassphraseOpts] = useState<PassphraseOptions>({
    words: 4,
    separator: '-',
  });

  const [output, setOutput] = useState('');
  const [strength, setStrength] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const savedMode = ctx.useLive<PasswordMode>('mode');
  const savedRandomOpts = ctx.useLive<RandomOptions>('randomOpts');
  const savedPassphraseOpts = ctx.useLive<PassphraseOptions>('passphraseOpts');

  const initialized = useRef(false);

  // Load state on mount
  useEffect(() => {
    if (!initialized.current) {
      if (savedMode !== undefined) {
        initialized.current = true;
        const m = savedMode || 'random';
        const r = savedRandomOpts || randomOpts;
        const p = savedPassphraseOpts || passphraseOpts;
        setMode(m);
        setRandomOpts(r);
        setPassphraseOpts(p);
        generate(m, r, p);
      }
    }
  }, [savedMode, savedRandomOpts, savedPassphraseOpts]);

  const saveState = (m: PasswordMode, r: RandomOptions, p: PassphraseOptions) => {
    void ctx.storage.set('mode', m);
    void ctx.storage.set('randomOpts', r);
    void ctx.storage.set('passphraseOpts', p);
  };

  const evaluateStrength = useCallback(
    async (pwd: string) => {
      if (!worker || !pwd) {
        setStrength(null);
        return;
      }
      setIsEvaluating(true);
      try {
        const res = await worker.run((api) => api.evaluatePattern(pwd));
        setStrength(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsEvaluating(false);
      }
    },
    [worker],
  );

  const generate = useCallback(
    (m: PasswordMode, r: RandomOptions, p: PassphraseOptions) => {
      let pwd = '';
      if (m === 'random') {
        // ensure at least one option is true
        if (!r.uppercase && !r.lowercase && !r.numbers && !r.symbols) {
          r = { ...r, lowercase: true };
          setRandomOpts(r);
        }
        pwd = generateRandomPassword(r);
      } else {
        pwd = generatePassphrase(p);
      }
      setOutput(pwd);
      void evaluateStrength(pwd);
      saveState(m, r, p);
    },
    [evaluateStrength],
  );

  const handleModeChange = (newMode: string) => {
    const m = newMode as PasswordMode;
    setMode(m);
    generate(m, randomOpts, passphraseOpts);
  };

  const updateRandom = (updates: Partial<RandomOptions>) => {
    const next = { ...randomOpts, ...updates };
    setRandomOpts(next);
    generate(mode, next, passphraseOpts);
  };

  const updatePassphrase = (updates: Partial<PassphraseOptions>) => {
    const next = { ...passphraseOpts, ...updates };
    setPassphraseOpts(next);
    generate(mode, randomOpts, next);
  };

  const renderStrength = () => {
    if (!strength) return null;
    const { score, crackTimeDisplay, warning, suggestions } = strength;
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-green-600'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

    return (
      <div className="mt-6 rounded-lg border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {score >= 3 ? (
              <ShieldCheck className="h-5 w-5 text-green-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 text-orange-500" />
            )}
            <span className="font-semibold">{labels[score]} Password</span>
          </div>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Crack time: {crackTimeDisplay || 'Instant'}
          </span>
        </div>

        <div className="flex h-2 w-full gap-1 overflow-hidden rounded-full bg-muted">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all ${i <= score ? colors[score] : 'bg-transparent'}`}
            />
          ))}
        </div>

        {(warning || (suggestions && suggestions.length > 0)) && (
          <div className="text-sm border-t pt-4 mt-4 text-muted-foreground space-y-1">
            {warning && <p className="text-orange-500 font-medium">⚠️ {warning}</p>}
            {suggestions?.map((s: string, i: number) => (
              <p key={i}>• {s}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row border rounded-lg bg-card p-4">
        <div className="flex-1 space-y-4">
          <Tabs value={mode} onValueChange={handleModeChange} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="random">Random Password</TabsTrigger>
              <TabsTrigger value="passphrase">Passphrase</TabsTrigger>
            </TabsList>

            <TabsContent value="random" className="space-y-6">
              <ToolField label={`Length: ${randomOpts.length}`}>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="4"
                    max="128"
                    value={randomOpts.length}
                    onChange={(e) => updateRandom({ length: parseInt(e.target.value, 10) })}
                    className="w-full accent-primary"
                  />
                  <Input
                    type="number"
                    min="4"
                    max="128"
                    value={randomOpts.length}
                    onChange={(e) => updateRandom({ length: parseInt(e.target.value, 10) || 16 })}
                    className="w-20"
                  />
                </div>
              </ToolField>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cb-upper"
                    checked={randomOpts.uppercase}
                    onCheckedChange={(c) => updateRandom({ uppercase: c })}
                  />
                  <label htmlFor="cb-upper" className="text-sm font-medium">
                    Uppercase (A-Z)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cb-lower"
                    checked={randomOpts.lowercase}
                    onCheckedChange={(c) => updateRandom({ lowercase: c })}
                  />
                  <label htmlFor="cb-lower" className="text-sm font-medium">
                    Lowercase (a-z)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cb-nums"
                    checked={randomOpts.numbers}
                    onCheckedChange={(c) => updateRandom({ numbers: c })}
                  />
                  <label htmlFor="cb-nums" className="text-sm font-medium">
                    Numbers (0-9)
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="cb-syms"
                    checked={randomOpts.symbols}
                    onCheckedChange={(c) => updateRandom({ symbols: c })}
                  />
                  <label htmlFor="cb-syms" className="text-sm font-medium">
                    Symbols (!@#)
                  </label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="passphrase" className="space-y-6">
              <ToolField label={`Word Count: ${passphraseOpts.words}`}>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="3"
                    max="20"
                    value={passphraseOpts.words}
                    onChange={(e) => updatePassphrase({ words: parseInt(e.target.value, 10) })}
                    className="w-full accent-primary"
                  />
                  <Input
                    type="number"
                    min="3"
                    max="20"
                    value={passphraseOpts.words}
                    onChange={(e) => updatePassphrase({ words: parseInt(e.target.value, 10) || 4 })}
                    className="w-20"
                  />
                </div>
              </ToolField>

              <ToolField label="Separator">
                <Select
                  value={passphraseOpts.separator}
                  onValueChange={(val) => updatePassphrase({ separator: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="-">Hyphen (-)</SelectItem>
                    <SelectItem value=" ">Space ( )</SelectItem>
                    <SelectItem value=".">Period (.)</SelectItem>
                    <SelectItem value=",">Comma (,)</SelectItem>
                    <SelectItem value="_">Underscore (_)</SelectItem>
                    <SelectItem value="">None</SelectItem>
                  </SelectContent>
                </Select>
              </ToolField>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Generated Password</h3>
          <Button onClick={() => generate(mode, randomOpts, passphraseOpts)} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>

        <ToolField label="" actions={<CopyButton value={output} />}>
          <div className="relative">
            <CodeEditor
              value={output}
              readOnly
              className="min-h-[120px] font-mono break-all text-xl"
            />
            {isEvaluating && (
              <div className="absolute top-2 right-2 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                <RefreshCw className="h-3 w-3 animate-spin" /> Evaluating...
              </div>
            )}
          </div>
        </ToolField>
      </div>

      {renderStrength()}
    </div>
  );
}
