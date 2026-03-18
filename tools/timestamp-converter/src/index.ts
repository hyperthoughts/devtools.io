import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'timestamp-converter',
    name: 'Unix Timestamp Converter',
    description: 'Convert timestamps to formatted dates and vice-versa',
    icon: 'clock',
    category: 'converters',
    version: '0.1.0',
    tags: ['time', 'date', 'iso', 'epoch', 'timestamp'],
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
