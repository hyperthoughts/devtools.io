import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and analyze JSON Web Tokens securely in your browser',
    icon: 'key',
    category: 'encoders',
    version: '0.1.0',
    tags: ['jwt', 'decode', 'token', 'header", "payload'],
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
