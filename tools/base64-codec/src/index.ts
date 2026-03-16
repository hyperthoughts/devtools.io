import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'base64-codec',
    name: 'Base64 Codec',
    description: 'Encode and decode Base64 strings with URL-safe variant support',
    icon: 'binary',
    category: 'encoders',
    version: '0.1.0',
    tags: ['base64', 'encode', 'decode', 'binary'],
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
