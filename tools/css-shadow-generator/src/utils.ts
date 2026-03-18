export interface ShadowLayer {
  id: string;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const r = parseInt(h.length === 3 ? h.slice(0, 1).repeat(2) : h.slice(0, 2), 16);
  const g = parseInt(h.length === 3 ? h.slice(1, 2).repeat(2) : h.slice(2, 4), 16);
  const b = parseInt(h.length === 3 ? h.slice(2, 3).repeat(2) : h.slice(4, 6), 16);
  return { r, g, b };
}

export function generateLayerString(layer: ShadowLayer): string {
  const { r, g, b } = hexToRgb(layer.color);
  const colorString = `rgba(${r}, ${g}, ${b}, ${layer.opacity / 100})`;
  const prefix = layer.inset ? 'inset ' : '';
  return `${prefix}${layer.x}px ${layer.y}px ${layer.blur}px ${layer.spread}px ${colorString}`;
}

export function generateShadowCSS(layers: ShadowLayer[]): string {
  if (layers.length === 0) return 'none';
  return layers.map(generateLayerString).join(',\n  ');
}
