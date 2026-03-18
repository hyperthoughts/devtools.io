import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'image-format-converter',
    name: 'Image Format Converter',
    description: 'Convert images between PNG, JPEG, WEBP and BMP',
    icon: 'image',
    category: 'converters',
    version: '0.1.0',
    tags: ['image', 'convert', 'png', 'jpg', 'jpeg', 'webp', 'bmp'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
  },
  Component,
};

export default definition;
