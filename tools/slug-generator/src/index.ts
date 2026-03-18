import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'slug-generator',
    name: 'URL Slug Generator',
    description: 'Convert strings into URL-friendly slugs',
    icon: 'link-2',
    category: 'generators',
    version: '0.1.0',
    tags: ['slug', 'url', 'seo', 'string', 'format'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
  },
  Component,
};

export default definition;
