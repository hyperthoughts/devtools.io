import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'word-counter',
    name: 'Word Counter',
    description: 'Count words, characters, lines, and more',
    icon: 'hash',
    category: 'text',
    version: '0.1.0',
    tags: ['word', 'character', 'count', 'text', 'metrics', 'length'],
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
