import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'gzip-codec',
    name: 'Gzip Compress/Decompress',
    description: 'Compress and decompress data using Gzip',
    icon: 'file-archive',
    category: 'encoders',
    version: '0.1.0',
    tags: ['gzip', 'compression', 'zip', 'inflate', 'deflate', 'codec'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsFileSystem: true,
  },
  Component,
};

export default definition;
