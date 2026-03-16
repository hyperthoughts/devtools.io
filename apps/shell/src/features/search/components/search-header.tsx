import { SortToggle } from '../../../components/sort-toggle.tsx';
import type { SortOption } from '../../../utils/search.ts';

interface SearchHeaderProps {
  totalCount: number;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  view: 'list' | 'grid';
  onViewChange: (view: 'list' | 'grid') => void;
}

export function SearchHeader({
  totalCount,
  sort,
  onSortChange,
  view,
  onViewChange,
}: SearchHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Found <span className="font-medium text-foreground">{totalCount.toLocaleString()}</span>{' '}
        tools
      </p>
      <SortToggle sort={sort} onSortChange={onSortChange} view={view} onViewChange={onViewChange} />
    </div>
  );
}
