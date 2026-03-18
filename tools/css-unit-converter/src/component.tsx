import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  CopyButton,
} from '@devtools/ui';
import { convertUnit, ALL_UNITS, type CSSUnit, type ConverterConfig } from './utils.ts';
import { Settings2 } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedVal = ctx.useLive<number>('value');
  const savedUnit = ctx.useLive<CSSUnit>('unit');
  const savedConfig = ctx.useLive<ConverterConfig>('config');

  const [value, setValue] = useState<number>(16);
  const [unit, setUnit] = useState<CSSUnit>('px');

  const [config, setConfig] = useState<ConverterConfig>({
    baseFontSize: 16,
    viewportWidth: 1920,
    viewportHeight: 1080,
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedVal !== undefined && savedUnit !== undefined && savedConfig !== undefined) {
        initialized.current = true;
        setValue(savedVal !== undefined ? savedVal : 16);
        setUnit(savedUnit || 'px');
        if (savedConfig) setConfig(savedConfig);
      }
    }
  }, [savedVal, savedUnit, savedConfig]);

  const updateValue = (v: number) => {
    setValue(v);
    void ctx.storage.set('value', v);
  };
  const updateUnit = (u: CSSUnit) => {
    setUnit(u);
    void ctx.storage.set('unit', u);
  };
  const updateConfig = (updates: Partial<ConverterConfig>) => {
    const next = { ...config, ...updates };
    setConfig(next);
    void ctx.storage.set('config', next);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    updateValue(isNaN(val) ? 0 : val);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border shadow-sm space-y-4">
            <h3 className="font-medium text-lg">Input Value</h3>
            <div className="flex gap-4">
              <Input
                type="number"
                value={value.toString()}
                onChange={handleValueChange}
                className="text-2xl font-medium h-14"
              />
              <Select value={unit} onValueChange={(v) => updateUnit(v as CSSUnit)}>
                <SelectTrigger className="w-32 h-14 text-lg font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_UNITS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {ALL_UNITS.map((u) => {
              if (u === unit) return null;
              const converted = convertUnit(value, unit, u, config);
              let label = '';
              if (u === 'rem' || u === 'em' || u === '%')
                label = `Based on ${config.baseFontSize}px`;
              if (u === 'vw') label = `Based on ${config.viewportWidth}px width`;
              if (u === 'vh') label = `Based on ${config.viewportHeight}px height`;

              return (
                <div
                  key={u}
                  className="bg-muted/30 p-4 rounded-xl border flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-muted-foreground uppercase">{u}</span>
                    <CopyButton value={`${converted}${u}`} />
                  </div>
                  <div>
                    <div className="text-2xl font-mono text-foreground break-all">{converted}</div>
                    {label && <div className="text-[10px] text-muted-foreground mt-1">{label}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card p-5 rounded-xl border space-y-4 bg-muted/10 sticky top-6">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium text-sm">Environment Settings</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Base Font Size (px)
              </label>
              <Input
                type="number"
                value={config.baseFontSize}
                onChange={(e) => updateConfig({ baseFontSize: parseFloat(e.target.value) || 16 })}
                className="h-9"
              />
              <p className="text-[10px] text-muted-foreground">
                Used for rem, em, and % calculations.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-muted-foreground">
                Viewport Width (px)
              </label>
              <Input
                type="number"
                value={config.viewportWidth}
                onChange={(e) =>
                  updateConfig({ viewportWidth: parseFloat(e.target.value) || 1920 })
                }
                className="h-9"
              />
              <p className="text-[10px] text-muted-foreground">Used for vw calculations.</p>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-muted-foreground">
                Viewport Height (px)
              </label>
              <Input
                type="number"
                value={config.viewportHeight}
                onChange={(e) =>
                  updateConfig({ viewportHeight: parseFloat(e.target.value) || 1080 })
                }
                className="h-9"
              />
              <p className="text-[10px] text-muted-foreground">Used for vh calculations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
