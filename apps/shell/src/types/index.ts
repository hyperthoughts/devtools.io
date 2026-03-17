import type { ToolCategory } from '@devtools/core';

export interface ToolEntry {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  tags: string[];
  version: string;
  source: string;
}

export interface FavoriteEntry {
  id: string;
  name: string;
  category: string;
  addedAt: number;
}
