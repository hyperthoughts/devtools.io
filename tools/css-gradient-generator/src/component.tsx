import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CopyButton,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@devtools/ui';
import { generateGradientString, type GradientConfig, type GradientStop } from './utils.ts';
import { Plus, Trash2, ArrowRightLeft } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedConfig = ctx.useLive<GradientConfig>('config');

  const [config, setConfig] = useState<GradientConfig>({
    type: 'linear',
    angle: 90,
    shape: 'circle',
    position: 'center',
    stops: [
      { id: '1', color: '#ff0000', position: 0 },
      { id: '2', color: '#0000ff', position: 100 },
    ],
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedConfig !== undefined) {
        initialized.current = true;
        if (savedConfig) setConfig(savedConfig);
      }
    }
  }, [savedConfig]);

  const updateConfig = (updates: Partial<GradientConfig>) => {
    const next = { ...config, ...updates };
    setConfig(next);
    void ctx.storage.set('config', next);
  };

  const addStop = () => {
    let newPos = 50;
    if (config.stops.length >= 2) {
      newPos = Math.round(
        (config.stops[0].position + config.stops[config.stops.length - 1].position) / 2,
      );
    }
    const stops = [
      ...config.stops,
      { id: crypto.randomUUID(), color: '#ffffff', position: newPos },
    ];
    updateConfig({ stops });
  };

  const removeStop = (id: string) => {
    if (config.stops.length <= 2) return;
    updateConfig({ stops: config.stops.filter((s) => s.id !== id) });
  };

  const updateStop = (id: string, updates: Partial<GradientStop>) => {
    const stops = config.stops.map((s) => (s.id === id ? { ...s, ...updates } : s));
    updateConfig({ stops });
  };

  const reverseStops = () => {
    const stops = [...config.stops].reverse().map((s, i, arr) => ({
      ...s,
      position: arr.length === config.stops.length ? 100 - s.position : s.position, // flip pos
    }));
    updateConfig({ stops });
  };

  const cssString = generateGradientString(config);
  const codeOutput = `background: ${config.stops[0].color}; /* fallback */
background: ${cssString};`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div
        className="w-full h-64 md:h-80 rounded-2xl shadow-inner border border-muted/50 transition-all duration-300 relative overflow-hidden flex items-center justify-center font-mono opacity-90 hover:opacity-100 group"
        style={{ background: cssString }}
      >
        <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
          <CopyButton value={codeOutput} /> <span className="text-sm font-medium">Copy CSS</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-card p-4 rounded-xl border space-y-4">
            <h3 className="font-medium">Gradient Settings</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={config.type}
                  onValueChange={(v: 'linear' | 'radial') => updateConfig({ type: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {config.type === 'linear' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Angle ({config.angle}°)</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={config.angle}
                    onChange={(e) => updateConfig({ angle: parseInt(e.target.value, 10) })}
                    className="w-full h-8"
                  />
                </div>
              )}

              {config.type === 'radial' && (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shape</label>
                    <Select
                      value={config.shape}
                      onValueChange={(v: 'circle' | 'ellipse') => updateConfig({ shape: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="circle">Circle</SelectItem>
                        <SelectItem value="ellipse">Ellipse</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Position</label>
                    <Select
                      value={config.position}
                      onValueChange={(v) => updateConfig({ position: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="top left">Top Left</SelectItem>
                        <SelectItem value="top right">Top Right</SelectItem>
                        <SelectItem value="bottom left">Bottom Left</SelectItem>
                        <SelectItem value="bottom right">Bottom Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-card p-4 rounded-xl border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Color Stops</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={reverseStops}>
                  <ArrowRightLeft className="h-4 w-4 mr-2" /> Reverse
                </Button>
                <Button variant="outline" size="sm" onClick={addStop}>
                  <Plus className="h-4 w-4 mr-2" /> Add Stop
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {[...config.stops]
                .sort((a, b) => a.position - b.position)
                .map((stop) => (
                  <div key={stop.id} className="flex items-center gap-3 p-2 bg-muted/40 rounded-lg">
                    <div className="relative shrink-0">
                      <div
                        className="w-8 h-8 rounded border shadow-sm cursor-pointer overflow-hidden"
                        style={{ backgroundColor: stop.color }}
                      >
                        <input
                          type="color"
                          value={stop.color}
                          onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                        />
                      </div>
                    </div>

                    <Input
                      value={stop.color}
                      onChange={(e) => updateStop(stop.id, { color: e.target.value })}
                      className="w-24 font-mono text-xs uppercase h-8"
                    />

                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={stop.position}
                        onChange={(e) =>
                          updateStop(stop.id, { position: parseInt(e.target.value, 10) })
                        }
                        className="flex-1"
                      />
                      <span className="w-10 text-xs font-mono text-right">{stop.position}%</span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      disabled={config.stops.length <= 2}
                      onClick={() => removeStop(stop.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <ToolField label="CSS Output" actions={<CopyButton value={codeOutput} />}>
            <div className="relative">
              <textarea
                readOnly
                value={codeOutput}
                className="flex w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-muted/50 font-mono resize-y min-h-[200px]"
              />
            </div>
          </ToolField>
        </div>
      </div>
    </div>
  );
}
