import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'html-markdown-converter',
    name: 'HTML <> Markdown Converter',
    description: 'Convert between HTML and Markdown formats',
    icon: 'file-code-2',
    category: 'converters',
    version: '0.1.0',
    tags: ['html', 'markdown', 'md', 'convert', 'format', 'dom'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsFileSystem: true,
  },
  Component,
};

export default definition;
