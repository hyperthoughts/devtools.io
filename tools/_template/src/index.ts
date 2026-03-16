import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'tool-name',
    name: 'Tool Name',
    description: 'What this tool does',
    icon: 'box',
    category: 'formatters',
    version: '0.1.0',
    tags: [],
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
