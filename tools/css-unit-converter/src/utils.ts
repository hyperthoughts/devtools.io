export type CSSUnit = 'px' | 'rem' | 'em' | '%' | 'vw' | 'vh' | 'pt' | 'pc' | 'in' | 'cm' | 'mm';

export interface ConverterConfig {
  baseFontSize: number; // For rem/em/% conversions
  viewportWidth: number; // For vw
  viewportHeight: number; // For vh
}

// 96 DPI baseline for absolute units
const ABSOLUTE_RATIOS: Record<string, number> = {
  in: 96,
  cm: 96 / 2.54,
  mm: 96 / 25.4,
  pt: 96 / 72,
  pc: (96 / 72) * 12,
};

export function convertToPx(value: number, from: CSSUnit, config: ConverterConfig): number {
  switch (from) {
    case 'px':
      return value;
    case 'rem':
    case 'em':
      return value * config.baseFontSize;
    case '%':
      return (value / 100) * config.baseFontSize;
    case 'vw':
      return (value / 100) * config.viewportWidth;
    case 'vh':
      return (value / 100) * config.viewportHeight;
    case 'in':
    case 'cm':
    case 'mm':
    case 'pt':
    case 'pc':
      return value * ABSOLUTE_RATIOS[from];
    default:
      return value;
  }
}

export function convertFromPx(pxValue: number, to: CSSUnit, config: ConverterConfig): number {
  switch (to) {
    case 'px':
      return pxValue;
    case 'rem':
    case 'em':
      return pxValue / config.baseFontSize;
    case '%':
      return (pxValue / config.baseFontSize) * 100;
    case 'vw':
      return (pxValue / config.viewportWidth) * 100;
    case 'vh':
      return (pxValue / config.viewportHeight) * 100;
    case 'in':
    case 'cm':
    case 'mm':
    case 'pt':
    case 'pc':
      return pxValue / ABSOLUTE_RATIOS[to];
    default:
      return pxValue;
  }
}

export function convertUnit(
  value: number,
  from: CSSUnit,
  to: CSSUnit,
  config: ConverterConfig,
): number {
  if (value === 0) return 0;
  if (from === to) return value;

  const pxValue = convertToPx(value, from, config);
  const result = convertFromPx(pxValue, to, config);

  // Format to max 4 decimal places to avoid floating point weirdness
  return Number(Math.round(Number(result + 'e4')) + 'e-4');
}

export const ALL_UNITS: CSSUnit[] = ['px', 'rem', 'em', '%', 'vw', 'vh', 'pt', 'in', 'cm', 'mm'];
