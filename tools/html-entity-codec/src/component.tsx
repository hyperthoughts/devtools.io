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
  Switch,
  Button,
  CopyButton,
} from '@devtools/ui';
import { encodeEntities, decodeEntities, type EncodeMode } from './utils.ts';
import { ArrowRightLeft } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [direction, setDirection] = useState<'encode' | 'decode'>('encode');
  const [mode, setMode] = useState<EncodeMode>('named');
  const [encodeEverything, setEncodeEverything] = useState(false);
  const [useNamedRefs, _setUseNamedRefs] = useState(true);
  const [allowUnsafe, _setAllowUnsafe] = useState(false);
  const [strict, setStrict] = useState(false);

  if (savedInput !== undefined && input === '' && savedInput) {
    setInput(savedInput);
  }

  const process = useCallback(
    (text: string) => {
      if (!text) {
        setOutput('');
        setError(null);
        return;
      }
      try {
        if (direction === 'encode') {
          setOutput(encodeEntities(text, mode, encodeEverything, useNamedRefs, allowUnsafe));
        } else {
          setOutput(decodeEntities(text, strict));
        }
        setError(null);
      } catch (e: any) {
        setError(e.message || String(e));
        setOutput('');
      }
    },
    [direction, mode, encodeEverything, useNamedRefs, allowUnsafe, strict],
  );

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    process(val);
  };

  const handleSwap = () => {
    const newDir = direction === 'encode' ? 'decode' : 'encode';
    setDirection(newDir);
    // swap input/output
    const prev = output;
    setInput(prev);
    void ctx.storage.set('input', prev);
    try {
      if (newDir === 'encode') {
        setOutput(encodeEntities(prev, mode, encodeEverything, useNamedRefs, allowUnsafe));
      } else {
        setOutput(decodeEntities(prev, strict));
      }
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
      setOutput('');
    }
  };

  // Re-process when settings change
  const reprocess = (overrides: Record<string, any> = {}) => {
    const d = overrides.direction ?? direction;
    const m = overrides.mode ?? mode;
    const ee = overrides.encodeEverything ?? encodeEverything;
    const nr = overrides.useNamedRefs ?? useNamedRefs;
    const au = overrides.allowUnsafe ?? allowUnsafe;
    const s = overrides.strict ?? strict;
    if (!input) return;
    try {
      if (d === 'encode') {
        setOutput(encodeEntities(input, m, ee, nr, au));
      } else {
        setOutput(decodeEntities(input, s));
      }
      setError(null);
    } catch (e: any) {
      setError(e.message || String(e));
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-end bg-card p-4 rounded-lg border">
        <ToolField label="Direction">
          <Select
            value={direction}
            onValueChange={(val) => {
              const d = val as 'encode' | 'decode';
              setDirection(d);
              reprocess({ direction: d });
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="encode">Encode</SelectItem>
              <SelectItem value="decode">Decode</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>

        {direction === 'encode' && (
          <ToolField label="Entity Style">
            <Select
              value={mode}
              onValueChange={(val) => {
                const m = val as EncodeMode;
                setMode(m);
                reprocess({ mode: m });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="named">Named (&amp;amp;)</SelectItem>
                <SelectItem value="decimal">Decimal (&#38;#38;)</SelectItem>
                <SelectItem value="hexadecimal">Hex (&#38;#x26;)</SelectItem>
              </SelectContent>
            </Select>
          </ToolField>
        )}

        {direction === 'encode' ? (
          <div className="flex flex-col gap-3 pb-2 pt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
              <Switch
                checked={encodeEverything}
                onCheckedChange={(c) => {
                  setEncodeEverything(c);
                  reprocess({ encodeEverything: c });
                }}
              />
              Encode Everything
            </label>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-2 pt-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer whitespace-nowrap">
              <Switch
                checked={strict}
                onCheckedChange={(c) => {
                  setStrict(c);
                  reprocess({ strict: c });
                }}
              />
              Strict Mode
            </label>
          </div>
        )}

        <div className="flex justify-end pb-2">
          <Button variant="outline" size="sm" onClick={handleSwap}>
            <ArrowRightLeft className="h-4 w-4 mr-2" /> Swap
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField label={direction === 'encode' ? 'Plain Text' : 'Encoded HTML'}>
          <CodeEditor
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            language="html"
            className="min-h-[300px]"
            placeholder={
              direction === 'encode' ? 'Enter text to encode...' : 'Paste encoded entities...'
            }
          />
        </ToolField>

        <ToolField
          label={direction === 'encode' ? 'Encoded Entities' : 'Decoded Text'}
          actions={output ? <CopyButton value={output} /> : undefined}
        >
          {error ? (
            <div className="min-h-[300px] p-4 text-red-500 bg-red-500/10 font-mono text-sm border rounded-md whitespace-pre-wrap overflow-auto">
              {error}
            </div>
          ) : (
            <CodeEditor value={output} readOnly language="html" className="min-h-[300px]" />
          )}
        </ToolField>
      </div>
    </div>
  );
}
