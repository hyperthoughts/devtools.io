import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'html-formatter',
    name: 'HTML Formatter',
    description: 'Prettify and format HTML code',
    icon: 'file-code-2',
    category: 'formatters',
    version: '0.1.0',
    tags: ['html', 'format', 'minify', 'beautify', 'pretty', 'code'],
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
