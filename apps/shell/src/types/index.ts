import type { ToolRegistryEntry } from '@devtools/storage';

export type ToolEntry = ToolRegistryEntry;

export interface FavoriteEntry {
  id: string;
  name: string;
  category: string;
  addedAt: number;
}
