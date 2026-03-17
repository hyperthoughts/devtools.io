import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@devtools/ui';
import { useToolRegistry } from '@devtools/storage';
import { PageTransition } from '../../../components/page-transition.tsx';
import { VirtualizedToolList } from '../../../components/virtualized-tool-list.tsx';
import { SortToggle } from '../../../components/sort-toggle.tsx';
import { filterTools, sortTools, type SortOption } from '../../../utils/search.ts';
import { useDebounce } from '../../../hooks/use-debounce.ts';
import type { ToolEntry } from '../../../types/index.ts';

type GroupBy = 'none' | 'category';

export function ExplorePage() {
  const tools = useToolRegistry();
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<SortOption>('name');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [groupBy, setGroupBy] = useState<GroupBy>('none');
  const debouncedQuery = useDebounce(query, 150);

  const filtered = useMemo(() => {
    const searched = filterTools(tools, debouncedQuery);
    return sortTools(searched, sort);
  }, [tools, debouncedQuery, sort]);

  const grouped = useMemo(() => {
    if (groupBy !== 'category') return null;
    const map = new Map<string, ToolEntry[]>();
    for (const tool of filtered) {
      map.set(tool.category, [...(map.get(tool.category) ?? []), tool]);
    }
    return [...map.entries()].toSorted(([a], [b]) => a.localeCompare(b));
  }, [filtered, groupBy]);

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">explore</h1>

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
                placeholder="filter tools ..."
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
            {filtered.length === 1 ? 'tool' : 'tools'}
            {debouncedQuery && ` matching "${debouncedQuery}"`}
          </p>

          {grouped ? (
            <div className="space-y-8">
              {grouped.map(([category, categoryTools]) => (
                <section key={category}>
                  <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {category}
                  </h2>
                  <VirtualizedToolList
                    items={categoryTools}
                    view={view}
                    height="auto"
                    emptyMessage="No tools in this category."
                  />
                </section>
              ))}
              {grouped.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">No tools match your filter.</p>
                </div>
              )}
            </div>
          ) : (
            <VirtualizedToolList
              items={filtered}
              view={view}
              height="calc(100vh - 280px)"
              emptyMessage="No tools match your filter."
            />
          )}
        </div>
      </div>
    </PageTransition>
  );
}
