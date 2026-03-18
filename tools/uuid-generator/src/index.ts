import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'uuid-generator',
    name: 'UUID & ULID Generator',
    description: 'Generate standard UUIDs, UUIDv7, and ULIDs',
    icon: 'fingerprint',
    category: 'generators',
    version: '0.1.0',
    tags: ['uuid', 'guid', 'ulid', 'generate', 'v4', 'v7'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsWorker: false,
    needsFileSystem: false,
  },
  Component,
};

export default definition;
