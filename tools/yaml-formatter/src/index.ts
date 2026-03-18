import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'yaml-formatter',
    name: 'YAML Formatter',
    description: 'Format and beautify YAML',
    icon: 'align-left',
    category: 'formatters',
    version: '0.1.0',
    tags: ['yaml', 'yml', 'format', 'beautify', 'indent'],
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
