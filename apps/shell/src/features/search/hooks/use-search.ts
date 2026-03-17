import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useToolRegistry } from '@devtools/storage';
import { filterTools, sortTools, type SortOption } from '../../../utils/search.ts';

export function useSearchTools() {
  const tools = useToolRegistry();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') ?? '';
  const [sort, setSort] = useState<SortOption>('relevance');
  const [view, setView] = useState<'list' | 'grid'>('list');

  const results = useMemo(() => {
    const filtered = filterTools(tools, queryParam);
    return sortTools(filtered, sort);
  }, [tools, queryParam, sort]);

  return {
    query: queryParam,
    results,
    sort,
    setSort,
    view,
    setView,
    totalCount: results.length,
  };
}
