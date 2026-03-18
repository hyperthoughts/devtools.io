import { useState, useCallback, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CopyButton, Input } from '@devtools/ui';
import { convertBase } from './utils.ts';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedDec = ctx.useLive<string>('dec');

  const [dec, setDec] = useState('');
  const [hex, setHex] = useState('');
  const [oct, setOct] = useState('');
  const [bin, setBin] = useState('');

  const [error, setError] = useState<string | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && savedDec !== undefined) {
      initialized.current = true;
      if (savedDec !== '') {
        setDec(savedDec);
        handleInput(savedDec, 10);
      }
    }
  }, [savedDec]);

  const handleInput = useCallback(
    (val: string, base: number) => {
      try {
        if (!val) {
          setDec('');
          setHex('');
          setOct('');
          setBin('');
          setError(null);
          void ctx.storage.set('dec', '');
          return;
        }

        const newDec = base === 10 ? val : convertBase(val, base, 10);
        const newHex = base === 16 ? val : convertBase(val, base, 16);
        const newOct = base === 8 ? val : convertBase(val, base, 8);
        const newBin = base === 2 ? val : convertBase(val, base, 2);

        setDec(newDec);
        setHex(newHex);
        setOct(newOct);
        setBin(newBin);
        setError(null);

        void ctx.storage.set('dec', newDec);
      } catch {
        // Just update the active field locally to allow typing and show error
        if (base === 10) setDec(val);
        if (base === 16) setHex(val);
        if (base === 8) setOct(val);
        if (base === 2) setBin(val);
        setError('Invalid input for selected base');
      }
    },
    [ctx.storage],
  );

  return (
    <div className="space-y-6 max-w-3xl">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded font-medium">{error}</div>
      )}

      <div className="grid gap-6">
        <ToolField label="Binary (Base 2)">
          <div className="relative">
            <Input
              value={bin}
              onChange={(e) => handleInput(e.target.value, 2)}
              placeholder="01010101"
              className="font-mono text-lg pr-12 h-12"
            />
            {bin && (
              <div className="absolute right-2 top-2 hover:opacity-80">
                <CopyButton value={bin} />
              </div>
            )}
          </div>
        </ToolField>

        <ToolField label="Octal (Base 8)">
          <div className="relative">
            <Input
              value={oct}
              onChange={(e) => handleInput(e.target.value, 8)}
              placeholder="125"
              className="font-mono text-lg pr-12 h-12"
            />
            {oct && (
              <div className="absolute right-2 top-2 hover:opacity-80">
                <CopyButton value={oct} />
              </div>
            )}
          </div>
        </ToolField>

        <ToolField label="Decimal (Base 10)">
          <div className="relative">
            <Input
              value={dec}
              onChange={(e) => handleInput(e.target.value, 10)}
              placeholder="85"
              className="font-mono text-lg pr-12 h-12"
            />
            {dec && (
              <div className="absolute right-2 top-2 hover:opacity-80">
                <CopyButton value={dec} />
              </div>
            )}
          </div>
        </ToolField>

        <ToolField label="Hexadecimal (Base 16)">
          <div className="relative">
            <Input
              value={hex}
              onChange={(e) => handleInput(e.target.value, 16)}
              placeholder="55"
              className="font-mono text-lg pr-12 h-12"
            />
            {hex && (
              <div className="absolute right-2 top-2 hover:opacity-80">
                <CopyButton value={hex} />
              </div>
            )}
          </div>
        </ToolField>
      </div>
    </div>
  );
}
