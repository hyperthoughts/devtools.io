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
