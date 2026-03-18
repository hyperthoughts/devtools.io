import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'javascript-formatter',
    name: 'JavaScript Formatter',
    description: 'Format JavaScript and TypeScript',
    icon: 'code-2',
    category: 'formatters',
    version: '0.1.0',
    tags: ['javascript', 'js', 'typescript', 'ts', 'format', 'prettier'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsWorker: true,
    needsFileSystem: true,
  },
  Component,
};

export default definition;
