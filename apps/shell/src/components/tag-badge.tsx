import { Link } from 'react-router';
import { cn } from '@devtools/ui';
import { ROUTES } from '../constants/routes.ts';

interface TagBadgeProps {
  tag: string;
  className?: string;
  linked?: boolean;
}

export function TagBadge({ tag, className, linked = true }: TagBadgeProps) {
  const baseClass = cn(
    'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
    className,
  );

  if (linked) {
    return (
      <Link to={`${ROUTES.SEARCH}?q=${encodeURIComponent(tag)}`} className={baseClass}>
        +{tag}
      </Link>
    );
  }

  return <span className={baseClass}>+{tag}</span>;
}
