import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'css-shadow-generator',
    name: 'CSS Shadow Generator',
    description: 'Design and generate smooth CSS shadows visually',
    icon: 'layers',
    category: 'generators',
    version: '0.1.0',
    tags: ['css', 'shadow', 'box-shadow', 'drop-shadow', 'design', 'layer'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
  },
  Component,
};

export default definition;
