import { VirtualizedToolList } from '../../../components/virtualized-tool-list.tsx';
import type { ToolEntry } from '../../../types/index.ts';

interface SearchResultsProps {
  results: ToolEntry[];
  view: 'list' | 'grid';
  height?: string;
  emptyMessage?: string;
}

export function SearchResults({
  results,
  view,
  height = 'calc(100vh - 220px)',
  emptyMessage,
}: SearchResultsProps) {
  return (
    <VirtualizedToolList items={results} view={view} height={height} emptyMessage={emptyMessage} />
  );
}
