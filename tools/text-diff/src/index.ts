import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'text-diff',
    name: 'Text Diff',
    description: 'Compare two text documents to see their differences',
    icon: 'split-square-horizontal',
    category: 'text',
    version: '0.1.0',
    tags: ['text', 'diff', 'compare', 'difference'],
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
