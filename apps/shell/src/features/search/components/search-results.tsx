import { cn } from '@devtools/ui';
import { SearchResultCard } from './search-result-card.tsx';
import type { ToolEntry } from '../../../types/index.ts';

interface SearchResultsProps {
  results: ToolEntry[];
  view: 'list' | 'grid';
}

export function SearchResults({ results, view }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">No tools matched your search.</p>
      </div>
    );
  }

  return (
    <div className={cn(view === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'flex flex-col gap-3')}>
      {results.map((tool, i) => (
        <SearchResultCard key={tool.id} tool={tool} index={i} view={view} />
      ))}
    </div>
  );
}
