import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'html-entity-codec',
    name: 'HTML Entity Codec',
    description: 'Encode and decode HTML entities',
    icon: 'code-xml',
    category: 'encoders',
    version: '0.1.0',
    tags: ['html', 'entity', 'encode', 'decode', 'escape', 'unescape'],
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
