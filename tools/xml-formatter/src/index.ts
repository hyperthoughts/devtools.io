import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Prettify and minify XML strings',
    icon: 'code',
    category: 'formatters',
    version: '0.1.0',
    tags: ['xml', 'format', 'minify', 'beautify', 'pretty', 'code'],
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
