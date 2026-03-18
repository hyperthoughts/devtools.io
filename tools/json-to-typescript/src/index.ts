import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'json-to-typescript',
    name: 'JSON to TS',
    description: 'Convert JSON to TypeScript interfaces',
    icon: 'brackets',
    category: 'converters',
    version: '0.1.0',
    tags: ['json', 'typescript', 'ts', 'interface', 'type', 'convert'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsWorker: false,
    needsFileSystem: true,
  },
  Component,
};

export default definition;
