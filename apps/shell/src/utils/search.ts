import { SearchIndex, type SearchIndexConfig } from './search-index.ts';
import type { ToolEntry } from '../types/index.ts';

const TOOL_SEARCH_CONFIG: SearchIndexConfig<ToolEntry> = {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'tags', weight: 1.5 },
    { name: 'description', weight: 1 },
    { name: 'category', weight: 1 },
  ],
  threshold: 0.35,
};

let index: SearchIndex<ToolEntry> | null = null;
let indexedRef: ToolEntry[] | null = null;

function getIndex(tools: ToolEntry[]): SearchIndex<ToolEntry> {
  if (index && indexedRef === tools) return index;
  index = new SearchIndex(tools, TOOL_SEARCH_CONFIG);
  indexedRef = tools;
  return index;
}

export function filterTools(tools: ToolEntry[], query: string): ToolEntry[] {
  if (!query.trim()) return tools;
  return getIndex(tools).search(query);
}

export type SortOption = 'relevance' | 'name' | 'category';

export function sortTools(tools: ToolEntry[], sort: SortOption): ToolEntry[] {
  if (sort === 'relevance') return tools;
  const sorted = [...tools];
  switch (sort) {
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'category':
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return sorted;
  }
}
