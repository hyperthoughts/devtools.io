import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'image-compressor',
    name: 'Image Compressor',
    description: 'Compress images directly in the browser',
    icon: 'image-down',
    category: 'media',
    version: '0.1.0',
    tags: ['image', 'compress', 'optimize', 'media', 'picture', 'resize'],
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
