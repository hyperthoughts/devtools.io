import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CopyButton, Button, Switch } from '@devtools/ui';
import { generateShadowCSS, generateLayerString, type ShadowLayer } from './utils.ts';
import { Plus, Trash2, GripVertical, Settings2, ShieldCheck } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedLayers = ctx.useLive<ShadowLayer[]>('layers');
  const savedBg = ctx.useLive<string>('bgColor');
  const savedBoxRef = ctx.useLive<string>('boxColor');

  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: '1', x: 0, y: 10, blur: 15, spread: -3, color: '#000000', opacity: 10, inset: false },
    { id: '2', x: 0, y: 4, blur: 6, spread: -2, color: '#000000', opacity: 5, inset: false },
  ]);

  const [activeLayerId, setActiveLayerId] = useState<string>('1');

  const [bgColor, setBgColor] = useState('#f8fafc');
  const [boxColor, setBoxColor] = useState('#ffffff');

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedLayers !== undefined) {
        initialized.current = true;
        if (savedLayers && savedLayers.length > 0) {
          setLayers(savedLayers);
          setActiveLayerId(savedLayers[0].id);
        }
        if (savedBg) setBgColor(savedBg);
        if (savedBoxRef) setBoxColor(savedBoxRef);
      }
    }
  }, [savedLayers, savedBg, savedBoxRef]);

  const updateLayers = (newLayers: ShadowLayer[]) => {
    setLayers(newLayers);
    void ctx.storage.set('layers', newLayers);
  };

  const addLayer = () => {
    const newId = crypto.randomUUID();
    const newLayers = [
      ...layers,
      { id: newId, x: 0, y: 4, blur: 10, spread: 0, color: '#000000', opacity: 15, inset: false },
    ];
    updateLayers(newLayers);
    setActiveLayerId(newId);
  };

  const removeLayer = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newLayers = layers.filter((l) => l.id !== id);
    if (newLayers.length > 0 && activeLayerId === id) {
      setActiveLayerId(newLayers[0].id);
    }
    updateLayers(newLayers);
  };

  const updateActiveLayer = (updates: Partial<ShadowLayer>) => {
    const newLayers = layers.map((l) => (l.id === activeLayerId ? { ...l, ...updates } : l));
    updateLayers(newLayers);
  };

  const handleBgColor = (c: string) => {
    setBgColor(c);
    void ctx.storage.set('bgColor', c);
  };
  const handleBoxColor = (c: string) => {
    setBoxColor(c);
    void ctx.storage.set('boxColor', c);
  };

  const activeLayer = layers.find((l) => l.id === activeLayerId) || layers[0];
  const cssString = generateShadowCSS(layers);
  const codeOutput = `box-shadow: ${cssString};`;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div
        className="w-full h-80 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        <div
          className="w-48 h-48 rounded-xl transition-all duration-300 flex items-center justify-center font-medium opacity-90 hover:opacity-100 group"
          style={{ backgroundColor: boxColor, boxShadow: cssString }}
        >
          <div className="bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-foreground">
            <CopyButton value={codeOutput} /> <span className="text-sm">Copy CSS</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-card p-4 rounded-xl border space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Layers</h3>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={addLayer}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {layers.map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayerId(layer.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors border ${
                    activeLayerId === layer.id
                      ? 'bg-muted border-primary/50'
                      : 'bg-background hover:bg-muted/50 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground opacity-50" />
                    <div
                      className="w-8 h-6 rounded shadow-sm border"
                      style={{ boxShadow: generateLayerString(layer), backgroundColor: boxColor }}
                    />
                    <span className="text-xs font-mono">
                      {layer.x}px {layer.y}px
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={(e) => removeLayer(layer.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card p-4 rounded-xl border space-y-4">
            <h3 className="font-medium text-sm flex items-center gap-2">
              <Settings2 className="h-4 w-4" /> Canvas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm">Canvas Color</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => handleBgColor(e.target.value)}
                  className="w-8 h-8 rounded shrink-0 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm">Box Color</label>
                <input
                  type="color"
                  value={boxColor}
                  onChange={(e) => handleBoxColor(e.target.value)}
                  className="w-8 h-8 rounded shrink-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {activeLayer ? (
            <div className="bg-card p-6 rounded-xl border space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Editor (Layer)
                </h3>
                <div className="flex items-center gap-3">
                  <label htmlFor="inset" className="text-sm font-medium cursor-pointer">
                    Inset
                  </label>
                  <Switch
                    id="inset"
                    checked={activeLayer.inset}
                    onCheckedChange={(v: boolean) => updateActiveLayer({ inset: v })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">X Offset</label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {activeLayer.x}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={activeLayer.x}
                      onChange={(e) => updateActiveLayer({ x: parseInt(e.target.value, 10) })}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Y Offset</label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {activeLayer.y}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={activeLayer.y}
                      onChange={(e) => updateActiveLayer({ y: parseInt(e.target.value, 10) })}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Blur</label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {activeLayer.blur}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150"
                      value={activeLayer.blur}
                      onChange={(e) => updateActiveLayer({ blur: parseInt(e.target.value, 10) })}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">Spread</label>
                      <span className="text-xs font-mono text-muted-foreground">
                        {activeLayer.spread}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={activeLayer.spread}
                      onChange={(e) => updateActiveLayer({ spread: parseInt(e.target.value, 10) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 border-t">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Color</label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {activeLayer.color}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={activeLayer.color}
                    onChange={(e) => updateActiveLayer({ color: e.target.value })}
                    className="w-full h-10 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Opacity</label>
                    <span className="text-xs font-mono text-muted-foreground">
                      {activeLayer.opacity}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={activeLayer.opacity}
                    onChange={(e) => updateActiveLayer({ opacity: parseInt(e.target.value, 10) })}
                    className="w-full h-10"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card p-6 border border-dashed rounded-xl h-48 flex items-center justify-center text-muted-foreground">
              Select or add a layer to edit
            </div>
          )}

          <ToolField label="CSS Code" actions={<CopyButton value={codeOutput} />}>
            <textarea
              readOnly
              value={codeOutput}
              className="flex w-full rounded-md border border-input px-3 py-4 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-muted/50 font-mono resize-none h-32"
            />
          </ToolField>
        </div>
      </div>
    </div>
  );
}
