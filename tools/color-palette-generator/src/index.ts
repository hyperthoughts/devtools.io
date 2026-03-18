import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    description: 'Generate harmonious color palettes based on a base color',
    icon: 'swatch-book',
    category: 'generators',
    version: '0.1.0',
    tags: ['color', 'palette', 'harmonies', 'scheme', 'design', 'ui'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
  },
  Component,
};

export default definition;
