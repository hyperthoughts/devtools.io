import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Input } from '@devtools/ui';
import { generateHarmony, generateShades, type HarmonyType, type PaletteColor } from './utils.ts';
import { CopyButton } from '@devtools/ui';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedBase = ctx.useLive<string>('baseColor');
  const savedType = ctx.useLive<HarmonyType>('harmonyType');

  const [baseColor, setBaseColor] = useState('#3b82f6');
  const [harmonyType, setHarmonyType] = useState<HarmonyType>('analogous');

  const [harmonyColors, setHarmonyColors] = useState<PaletteColor[]>([]);
  const [shadeColors, setShadeColors] = useState<PaletteColor[]>([]);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedBase !== undefined && savedType !== undefined) {
        initialized.current = true;
        const base = savedBase || '#3b82f6';
        const type = savedType || 'analogous';
        setBaseColor(base);
        setHarmonyType(type);
        updatePalettes(base, type);
      }
    }
  }, [savedBase, savedType]);

  const updatePalettes = (base: string, type: HarmonyType) => {
    setHarmonyColors(generateHarmony(base, type));
    setShadeColors(generateShades(base, 4));
  };

  const handleBaseChange = (val: string) => {
    setBaseColor(val);
    void ctx.storage.set('baseColor', val);
    updatePalettes(val, harmonyType);
  };

  const handleTypeChange = (val: HarmonyType) => {
    setHarmonyType(val);
    void ctx.storage.set('harmonyType', val);
    updatePalettes(baseColor, val);
  };

  const ColorBlock = ({ color, label }: { color: PaletteColor; label?: string }) => (
    <div className="flex flex-col gap-2 group">
      <div
        className="h-24 md:h-32 w-full rounded-lg shadow-sm border border-black/5 flex items-end p-2 transition-transform hover:scale-105"
        style={{ backgroundColor: color.hex }}
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-background/80 backdrop-blur rounded p-1">
          <CopyButton value={color.hex} />
        </div>
      </div>
      <div className="text-xs space-y-1">
        {label && <div className="font-semibold text-muted-foreground">{label}</div>}
        <div className="font-mono font-medium uppercase">{color.hex}</div>
        <div className="font-mono text-muted-foreground">{color.rgb}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="bg-card p-4 rounded-xl border space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => handleBaseChange(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer shrink-0 border"
              />
              <Input
                value={baseColor}
                onChange={(e) => handleBaseChange(e.target.value)}
                className="font-mono uppercase h-12"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Harmony Type</label>
            <Select value={harmonyType} onValueChange={(v) => handleTypeChange(v as HarmonyType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="analogous">Analogous</SelectItem>
                <SelectItem value="complementary">Complementary</SelectItem>
                <SelectItem value="split-complementary">Split Complementary</SelectItem>
                <SelectItem value="double-split-complementary">
                  Double Split Complementary
                </SelectItem>
                <SelectItem value="triadic">Triadic</SelectItem>
                <SelectItem value="tetradic">Tetradic</SelectItem>
                <SelectItem value="rectangle">Rectangle</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">Harmony Palette</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {harmonyColors.length > 0 ? (
                harmonyColors.map((c, i) => (
                  <ColorBlock
                    key={`harm-${i}`}
                    color={c}
                    label={i === 0 ? 'Base' : `Color ${i + 1}`}
                  />
                ))
              ) : (
                <div className="col-span-full text-muted-foreground text-sm py-4">
                  Invalid color format.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-lg border-b pb-2">Tints & Shades</h3>
            <div className="grid grid-cols-5 md:grid-cols-9 gap-2">
              {shadeColors.length > 0 &&
                shadeColors.map((c, i) => (
                  <div key={`shade-${i}`} className="flex flex-col gap-1 group">
                    <div
                      className="h-16 w-full rounded border border-black/5 transition-transform hover:scale-110 flex items-center justify-center relative"
                      style={{ backgroundColor: c.hex }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-background/50 backdrop-blur-sm rounded">
                        <CopyButton value={c.hex} />
                      </div>
                    </div>
                    <div className="text-[10px] font-mono text-center uppercase tracking-tighter">
                      {c.hex}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
