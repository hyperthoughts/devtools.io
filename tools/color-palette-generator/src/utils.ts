import { colord, extend } from 'colord';
import harmoniesPlugin from 'colord/plugins/harmonies';
import mixPlugin from 'colord/plugins/mix';

extend([harmoniesPlugin, mixPlugin]);

export type HarmonyType =
  | 'analogous'
  | 'complementary'
  | 'double-split-complementary'
  | 'rectangle'
  | 'split-complementary'
  | 'tetradic'
  | 'triadic';

export interface PaletteColor {
  hex: string;
  rgb: string;
  hsl: string;
}

export function generateHarmony(baseColor: string, type: HarmonyType): PaletteColor[] {
  const c = colord(baseColor);
  if (!c.isValid()) return [];

  const harmony = c.harmonies(type);
  const colors = [c, ...harmony];

  return colors.map((color) => ({
    hex: color.toHex(),
    rgb: color.toRgbString(),
    hsl: color.toHslString(),
  }));
}

export function generateShades(baseColor: string, count: number = 4): PaletteColor[] {
  const c = colord(baseColor);
  if (!c.isValid()) return [];

  const shades: PaletteColor[] = [];
  // Tints (lighter)
  for (let i = count; i > 0; i--) {
    const tint = c.mix('#ffffff', i * (1 / (count + 1)));
    shades.push({ hex: tint.toHex(), rgb: tint.toRgbString(), hsl: tint.toHslString() });
  }
  shades.push({ hex: c.toHex(), rgb: c.toRgbString(), hsl: c.toHslString() });
  // Shades (darker)
  for (let i = 1; i <= count; i++) {
    const shade = c.mix('#000000', i * (1 / (count + 1)));
    shades.push({ hex: shade.toHex(), rgb: shade.toRgbString(), hsl: shade.toHslString() });
  }

  return shades;
}
