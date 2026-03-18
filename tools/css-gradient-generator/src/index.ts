import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'css-gradient-generator',
    name: 'CSS Gradient Generator',
    description: 'Design and generate CSS gradients visually',
    icon: 'palette',
    category: 'generators',
    version: '0.1.0',
    tags: ['css', 'gradient', 'color', 'design', 'background', 'linear', 'radial'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
  },
  Component,
};

export default definition;
