import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@devtools/ui';
import { cn } from '@devtools/ui';
import type { SortOption } from '../utils/search.ts';

interface SortToggleProps {
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: 'list' | 'grid';
  onViewChange: (view: 'list' | 'grid') => void;
}

export function SortToggle({ sort, onSortChange, view, onViewChange }: SortToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="name">Name</SelectItem>
          <SelectItem value="category">Category</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex rounded-md border">
        <button
          type="button"
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-l-md transition-colors',
            view === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
          )}
          onClick={() => onViewChange('list')}
          aria-label="List view"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          type="button"
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-r-md border-l transition-colors',
            view === 'grid' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
          )}
          onClick={() => onViewChange('grid')}
          aria-label="Grid view"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
