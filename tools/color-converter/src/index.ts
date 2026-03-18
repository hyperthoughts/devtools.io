import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Visualize colors and convert between HEX, RGB, HSL, and more',
    icon: 'palette',
    category: 'converters',
    version: '0.1.0',
    tags: ['color', 'hex', 'rgb', 'hsl', 'picker', 'palette'],
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
