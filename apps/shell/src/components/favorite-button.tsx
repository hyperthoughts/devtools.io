import { cn } from '@devtools/ui';
import { useFavorites } from '../contexts/favorites-context.tsx';
import type { ToolEntry } from '../types/index.ts';

interface FavoriteButtonProps {
  tool: ToolEntry;
  className?: string;
}

export function FavoriteButton({ tool, className }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(tool.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(tool);
      }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md p-1 transition-colors hover:text-primary',
        favorited ? 'text-primary' : 'text-muted-foreground/50',
        className,
      )}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    </button>
  );
}
