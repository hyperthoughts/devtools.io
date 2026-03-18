import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Live markdown editor with GitHub Flavored Markdown and syntax highlighting',
    icon: 'file-text',
    category: 'formatters',
    version: '0.1.0',
    tags: ['markdown', 'preview', 'gfm', 'editor'],
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
