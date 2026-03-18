import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and visualize regular expressions against text',
    icon: 'brackets',
    category: 'validators',
    version: '0.1.0',
    tags: ['regex', 'regexp', 'regular', 'expression', 'match', 'test'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsWorker: true,
    needsFileSystem: false,
  },
  Component,
};

export default definition;
