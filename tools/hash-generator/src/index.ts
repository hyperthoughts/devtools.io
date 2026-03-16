import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate SHA-256, SHA-1, and MD5 hashes from text or files',
    icon: 'fingerprint',
    category: 'crypto',
    version: '0.1.0',
    tags: ['hash', 'sha256', 'sha1', 'md5', 'checksum'],
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
