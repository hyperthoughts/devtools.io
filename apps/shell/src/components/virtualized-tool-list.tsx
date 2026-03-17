import { useRef, useMemo, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { SearchResultCard } from '../features/search/components/search-result-card.tsx';
import type { ToolEntry } from '../types/index.ts';

interface VirtualizedToolListProps {
  items: ToolEntry[];
  view: 'list' | 'grid';
  /** CSS height for the scroll container. Use "auto" for inline rendering without virtualization. */
  height?: string;
  overscan?: number;
  emptyMessage?: string;
}

const LIST_ESTIMATE = 130;
const GRID_ESTIMATE = 170;
const LIST_GAP = 12;
const GRID_GAP = 16;
const GRID_COLS = 2;

export function VirtualizedToolList({
  items,
  view,
  height = '100%',
  overscan = 5,
  emptyMessage = 'No tools matched your search.',
}: VirtualizedToolListProps) {
  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  if (height === 'auto') {
    return <StaticToolList items={items} view={view} />;
  }

  return <VirtualizedToolListInner items={items} view={view} height={height} overscan={overscan} />;
}

function StaticToolList({ items, view }: { items: ToolEntry[]; view: 'list' | 'grid' }) {
  if (view === 'grid') {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((tool, i) => (
          <SearchResultCard key={tool.id} tool={tool} index={i} view={view} animate />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((tool, i) => (
        <SearchResultCard key={tool.id} tool={tool} index={i} view={view} animate />
      ))}
    </div>
  );
}

function VirtualizedToolListInner({
  items,
  view,
  height,
  overscan,
}: {
  items: ToolEntry[];
  view: 'list' | 'grid';
  height: string;
  overscan: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const rows = useMemo(() => {
    if (view === 'list') return items.map((item) => [item]);
    return Array.from({ length: Math.ceil(items.length / GRID_COLS) }, (_, i) =>
      items.slice(i * GRID_COLS, (i + 1) * GRID_COLS),
    );
  }, [items, view]);

  const gap = view === 'grid' ? GRID_GAP : LIST_GAP;
  const estimate = view === 'grid' ? GRID_ESTIMATE : LIST_ESTIMATE;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimate,
    overscan,
    gap,
  });

  const measureRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node) virtualizer.measureElement(node);
    },
    [virtualizer],
  );

  return (
    <div ref={scrollRef} className="overflow-y-auto" style={{ height }}>
      <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              ref={measureRef}
              data-index={virtualRow.index}
              className="absolute left-0 top-0 w-full"
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              {view === 'grid' ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {row.map((tool) => (
                    <SearchResultCard
                      key={tool.id}
                      tool={tool}
                      index={0}
                      view={view}
                      animate={false}
                    />
                  ))}
                </div>
              ) : (
                <SearchResultCard tool={row[0]} index={0} view={view} animate={false} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
