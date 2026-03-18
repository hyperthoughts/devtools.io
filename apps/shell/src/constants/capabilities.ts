import type { ToolCapabilities } from '@devtools/core';

export interface CapabilityDisplay {
  key: keyof ToolCapabilities;
  label: string;
}

export const CAPABILITIES_DISPLAYS: CapabilityDisplay[] = [
  { key: 'needsStorage', label: 'Storage' },
  { key: 'needsWorker', label: 'Worker' },
  { key: 'needsFileSystem', label: 'File System' },
];
