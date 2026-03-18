import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'text-case-converter',
    name: 'Text Case Converter',
    description: 'Convert text between different string cases',
    icon: 'type',
    category: 'text',
    version: '0.1.0',
    tags: ['text', 'case', 'camel', 'snake', 'convert', 'string'],
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
