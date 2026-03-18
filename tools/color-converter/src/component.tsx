import { useState, useEffect } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, Input, CopyButton } from '@devtools/ui';
import { HexAlphaColorPicker } from 'react-colorful';
import { parseAndFormatColor, type ColorData } from './utils.ts';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedColor = ctx.useLive<string>('color');
  const [colorStr, setColorStr] = useState<string>('#3b82f6');
  const [data, setData] = useState<ColorData | null>(null);

  useEffect(() => {
    if (savedColor !== undefined && savedColor !== colorStr) {
      setColorStr(savedColor || '#3b82f6');
      setData(parseAndFormatColor(savedColor || '#3b82f6'));
    }
  }, [savedColor]);

  // Handle color picker change
  const handlePickerChange = (newColor: string) => {
    setColorStr(newColor);
    setData(parseAndFormatColor(newColor));
    void ctx.storage.set('color', newColor);
  };

  // Handle text input change
  const handleInputChange = (val: string) => {
    setColorStr(val);
    const parsed = parseAndFormatColor(val);
    setData(parsed);
    if (parsed) {
      // Only save to storage if valid
      void ctx.storage.set('color', parsed.hex);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <HexAlphaColorPicker color={data ? data.hex : colorStr} onChange={handlePickerChange} />
          </div>
          <div
            className="h-24 w-full rounded-xl border shadow-inner"
            style={{ backgroundColor: data ? data.hex : colorStr }}
          />
        </div>

        <div className="space-y-4">
          <ToolField label="Input Color (Any format)">
            <Input
              value={colorStr}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="e.g. #ff0000, rgb(255, 0, 0), red"
              className="font-mono text-lg"
            />
          </ToolField>

          {data ? (
            <div className="rounded-lg border bg-card divide-y">
              <ColorRow label="HEX" value={data.hex} />
              <ColorRow label="RGB" value={data.rgb} />
              <ColorRow label="HSL" value={data.hsl} />
              <ColorRow label="HWB" value={data.hwb} />
              <ColorRow label="LCH" value={data.lch} />
              <ColorRow label="CMYK" value={data.cmyk} />
              <ColorRow label="Name (Closest)" value={data.name} />
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              Invalid color format.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ColorRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 gap-4 hover:bg-muted/50 transition-colors">
      <span className="font-medium text-muted-foreground min-w-[120px]">{label}</span>
      <div className="flex items-center gap-3 overflow-hidden">
        <span className="font-mono flex-1 truncate text-right sm:text-left">{value}</span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}
