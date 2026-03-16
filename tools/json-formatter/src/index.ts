import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and minify JSON with syntax highlighting',
    icon: 'braces',
    category: 'formatters',
    version: '0.1.0',
    tags: ['json', 'format', 'validate', 'minify', 'pretty-print'],
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
