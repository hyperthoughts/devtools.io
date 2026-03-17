export interface ToolStorageEntry {
  id?: number;
  toolId: string;
  key: string;
  value: unknown;
  updatedAt: number;
}

export interface AppMetadata {
  id: string;
  value: unknown;
}

export interface ToolRegistryEntry {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  version: string;
  source: string;
}
