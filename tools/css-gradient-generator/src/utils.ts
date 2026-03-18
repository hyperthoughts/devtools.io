export type GradientType = 'linear' | 'radial';

export interface GradientStop {
  id: string;
  color: string;
  position: number;
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // for linear
  shape: 'circle' | 'ellipse'; // for radial
  position: string; // for radial (e.g., 'center', 'top left')
  stops: GradientStop[];
}

export function generateGradientString(config: GradientConfig): string {
  const sortedStops = [...config.stops].sort((a, b) => a.position - b.position);
  const stopsString = sortedStops.map((s) => `${s.color} ${s.position}%`).join(', ');

  const prefix =
    config.type === 'linear'
      ? `linear-gradient(${config.angle}deg`
      : `radial-gradient(${config.shape} at ${config.position}`;

  return `${prefix}, ${stopsString})`;
}
