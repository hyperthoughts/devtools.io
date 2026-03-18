import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'json-csv-converter',
    name: 'JSON <> CSV Converter',
    description: 'Convert between JSON and CSV formats',
    icon: 'file-spreadsheet',
    category: 'converters',
    version: '0.1.0',
    tags: ['json', 'csv', 'convert', 'format', 'spreadsheet', 'excel'],
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
