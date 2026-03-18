import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'json-schema-validator',
    name: 'JSON Schema Validator',
    description: 'Validate JSON against a JSON schema',
    icon: 'check-square',
    category: 'validators',
    version: '0.1.0',
    tags: ['json', 'schema', 'validator', 'ajv', 'check'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsWorker: false,
    needsFileSystem: true,
  },
  Component,
};

export default definition;
