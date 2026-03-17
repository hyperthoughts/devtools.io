import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@devtools/ui';
import { PageTransition } from '../../../components/page-transition.tsx';
import { SearchResults } from '../../search/components/search-results.tsx';
import { SortToggle } from '../../../components/sort-toggle.tsx';
import { useFavorites } from '../../../contexts/favorites-context.tsx';
import { filterTools, sortTools, type SortOption } from '../../../utils/search.ts';
import { useDebounce } from '../../../hooks/use-debounce.ts';
import type { ToolEntry } from '../../../types/index.ts';

type GroupBy = 'none' | 'category';

interface FavoritesPageProps {
  tools: ToolEntry[];
}

export function FavoritesPage({ tools }: FavoritesPageProps) {
  const { favorites } = useFavorites();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('name');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const debouncedQuery = useDebounce(query, 150);

  const favoriteTools = useMemo(() => {
    const ids = new Set(favorites.map((f) => f.id));
    return tools.filter((t) => ids.has(t.id));
  }, [tools, favorites]);

  const filtered = useMemo(() => {
    const searched = filterTools(favoriteTools, debouncedQuery);
    return sortTools(searched, sort);
  }, [favoriteTools, debouncedQuery, sort]);

  const grouped = useMemo(() => {
    if (groupBy !== 'category') return null;
    const map = new Map<string, ToolEntry[]>();
    for (const tool of filtered) {
      const list = map.get(tool.category) ?? [];
      list.push(tool);
      map.set(tool.category, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, groupBy]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">favorites</h1>

        {favorites.length === 0 ? (
          <div className="py-16 text-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 text-muted-foreground/40"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <p className="text-sm text-muted-foreground">
              No favorites yet. Click the heart icon on any tool to save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 sm:max-w-xs">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  /
                </span>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="filter favorites ..."
                  className="h-9 w-full rounded-md border border-input bg-transparent pl-7 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
                />
              </div>

              <div className="flex items-center gap-2">
                <Select value={groupBy} onValueChange={(v) => setGroupBy(v as GroupBy)}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No grouping</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
                <SortToggle sort={sort} onSortChange={setSort} view={view} onViewChange={setView} />
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'favorite' : 'favorites'}
              {debouncedQuery && ` matching "${debouncedQuery}"`}
            </p>

            {grouped ? (
              <div className="space-y-8">
                {grouped.map(([category, categoryTools]) => (
                  <section key={category}>
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {category}
                    </h2>
                    <SearchResults results={categoryTools} view={view} height="auto" />
                  </section>
                ))}
                {grouped.length === 0 && (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">No favorites match your filter.</p>
                  </div>
                )}
              </div>
            ) : (
              <SearchResults results={filtered} view={view} />
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
