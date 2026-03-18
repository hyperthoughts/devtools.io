import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'json-yaml-converter',
    name: 'JSON <> YAML Converter',
    description: 'Convert between JSON and YAML formats',
    icon: 'file-json-2',
    category: 'converters',
    version: '0.1.0',
    tags: ['json', 'yaml', 'yml', 'convert', 'format'],
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
