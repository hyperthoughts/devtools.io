import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'cron-expression',
    name: 'Cron Generator',
    description: 'Generate and parse cron expressions',
    icon: 'clock',
    category: 'generators',
    version: '0.1.0',
    tags: ['cron', 'schedule', 'time', 'generator', 'parser'],
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
