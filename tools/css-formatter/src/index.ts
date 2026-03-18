import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'css-formatter',
    name: 'CSS Formatter',
    description: 'Prettify and format CSS code',
    icon: 'paintbrush-2',
    category: 'formatters',
    version: '0.1.0',
    tags: ['css', 'format', 'minify', 'beautify', 'pretty', 'code'],
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
