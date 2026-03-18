import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'string-escape',
    name: 'String Escape',
    description: 'Escape and unescape strings',
    icon: 'quote',
    category: 'text',
    version: '0.1.0',
    tags: ['string', 'escape', 'unescape', 'json', 'quotes'],
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
