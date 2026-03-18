import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'number-base-converter',
    name: 'Number Base Converter',
    description: 'Convert numbers between different bases',
    icon: 'binary',
    category: 'converters',
    version: '0.1.0',
    tags: ['number', 'base', 'hex', 'binary', 'octal', 'decimal', 'convert'],
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
