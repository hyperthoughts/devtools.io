import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords and measure entropy',
    icon: 'key',
    category: 'generators',
    version: '0.1.0',
    tags: ['password', 'secure', 'zxcvbn', 'entropy', 'hash'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsWorker: true,
    needsFileSystem: false,
  },
  Component,
};

export default definition;
