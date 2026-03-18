import { TOOL_CONTRACT_VERSION } from '@devtools/core';
import type { ToolDefinition } from '@devtools/core';
import { Component } from './component.tsx';

const definition: ToolDefinition = {
  meta: {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format, validate, and minify SQL queries across various dialects',
    icon: 'database',
    category: 'formatters',
    version: '0.1.0',
    tags: ['sql', 'format', 'minify', 'beautify'],
    contractVersion: TOOL_CONTRACT_VERSION,
  },
  capabilities: {
    needsStorage: true,
    needsWorker: true,
    needsFileSystem: false,
    workerEntry: './worker.ts',
  },
  Component,
};

export default definition;
