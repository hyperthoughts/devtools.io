import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'url-codec',
    name: 'URL Codec & Parser',
    description: 'Encode/decode URLs and parse URL components into an editable table',
    icon: 'link',
    category: 'encoders',
    version: '0.1.0',
    tags: ['url', 'encode', 'decode', 'parser', 'uri'],
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
