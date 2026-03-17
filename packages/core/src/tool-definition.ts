import type { FC } from 'react';
import type { ToolCategory } from './categories.ts';
import { TOOL_CONTRACT_VERSION } from './version.ts';

export interface ToolMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: ToolCategory;
  version: string;
  tags: string[];
  contractVersion: typeof TOOL_CONTRACT_VERSION;
}

export interface ToolCapabilities {
  needsStorage?: boolean;
  needsWorker?: boolean;
  needsFileSystem?: boolean;
  workerEntry?: string;
}

export interface ToolContext {
  toolId: string;
  storage: ToolStorage;
  useLive: <T>(key: string) => T | undefined;
  worker: ToolWorkerPool | null;
  filesystem: ToolFileSystem | null;
  theme: 'dark' | 'light';
}

export interface ToolStorage {
  get<T = unknown>(key: string): Promise<T | undefined>;
  set(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
  getAll(): Promise<Array<{ key: string; value: unknown }>>;
  clear(): Promise<void>;
}

export interface ToolWorkerPool {
  run<R>(fn: (api: unknown) => Promise<R>): Promise<R>;
  terminate(): void;
}

export interface ToolFileSystem {
  readonly isNativeSupported: boolean;
  openFile(options?: { accept?: string[]; multiple?: boolean }): Promise<File | File[] | null>;
  saveFile(blob: Blob, suggestedName?: string): Promise<void>;
  openDirectory(): Promise<FileSystemDirectoryHandle | null>;
}

export interface ToolDefinition {
  meta: ToolMeta;
  capabilities: ToolCapabilities;
  Component: FC<{ ctx: ToolContext }>;
  onMount?: (ctx: ToolContext) => void | Promise<void>;
  onUnmount?: (ctx: ToolContext) => void | Promise<void>;
}
