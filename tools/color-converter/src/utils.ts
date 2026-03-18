import { colord, extend } from 'colord';
import cmykPlugin from 'colord/plugins/cmyk';
import hwbPlugin from 'colord/plugins/hwb';
import lchPlugin from 'colord/plugins/lch';
import namesPlugin from 'colord/plugins/names';

extend([cmykPlugin, hwbPlugin, lchPlugin, namesPlugin]);

export interface ColorData {
  hex: string;
  rgb: string;
  hsl: string;
  hwb: string;
  lch: string;
  cmyk: string;
  name: string;
  alpha: number;
}

export function parseAndFormatColor(input: string): ColorData | null {
  const c = colord(input);
  if (!c.isValid()) return null;

  return {
    hex: c.alpha() < 1 ? c.toHex() : c.toHex(), // toHex includes alpha if < 1, otherwise 6 digit
    rgb: c.toRgbString(),
    hsl: c.toHslString(),
    hwb: c.toHwbString(),
    lch: c.toLchString(),
    cmyk: c.toCmykString(),
    name: c.toName({ closest: true }) || 'Unknown',
    alpha: c.alpha(),
  };
}
