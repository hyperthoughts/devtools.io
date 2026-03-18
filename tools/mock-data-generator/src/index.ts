import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'mock-data-generator',
    name: 'Mock Data Generator',
    description: 'Generate mock data using Faker',
    icon: 'database',
    category: 'generators',
    version: '0.1.0',
    tags: ['mock', 'data', 'fake', 'generator', 'json', 'faker'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsWorker: true,
    needsFileSystem: true,
  },
  Component,
};

export default definition;
