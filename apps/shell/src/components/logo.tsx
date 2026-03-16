import { Link } from 'react-router';
import { siteConfig } from '../config/site.ts';

interface LogoProps {
  size?: 'sm' | 'lg';
}

export function Logo({ size = 'sm' }: LogoProps) {
  const isLarge = size === 'lg';

  return (
    <Link to="/" className="group inline-flex items-baseline gap-0 no-underline">
      <span
        className={`font-mono font-light text-muted-foreground transition-colors group-hover:text-foreground ${isLarge ? 'text-4xl' : 'text-base'}`}
      >
        ./
      </span>
      <span
        className={`font-bold tracking-tight text-foreground ${isLarge ? 'text-6xl' : 'text-lg'}`}
      >
        {siteConfig.name}
      </span>
      {isLarge && <span className="ml-2 text-sm font-medium text-primary">{siteConfig.stage}</span>}
    </Link>
  );
}
