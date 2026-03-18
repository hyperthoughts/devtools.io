import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'css-unit-converter',
    name: 'CSS Unit Converter',
    description: 'Convert between px, rem, em, vh, vw and more',
    icon: 'ruler',
    category: 'converters',
    version: '0.1.0',
    tags: ['css', 'units', 'px', 'rem', 'em', 'vw', 'vh'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
  },
  Component,
};

export default definition;
