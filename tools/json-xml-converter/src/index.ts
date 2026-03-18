import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'json-xml-converter',
    name: 'JSON <> XML Converter',
    description: 'Convert between JSON and XML formats',
    icon: 'braces',
    category: 'converters',
    version: '0.1.0',
    tags: ['json', 'xml', 'convert', 'format', 'parse'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsFileSystem: true,
  },
  Component,
};

export default definition;
