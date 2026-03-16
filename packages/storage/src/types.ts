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
