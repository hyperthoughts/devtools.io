import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'qr-code-tool',
    name: 'QR Code Tool',
    description: 'Generate and decode QR codes locally in your browser',
    icon: 'qr-code',
    category: 'encoders',
    version: '0.1.0',
    tags: ['qr', 'barcode', 'generate', 'scan', 'decode'],
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
