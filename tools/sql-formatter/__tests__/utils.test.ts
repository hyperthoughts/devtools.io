import { describe, it, expect } from 'vite-plus/test';
import { DIALECTS, KEYWORD_CASES, INDENTS } from '../src/utils.ts';

describe('sql-formatter utils', () => {
  it('exports options', () => {
    expect(DIALECTS.length).toBeGreaterThan(0);
    expect(KEYWORD_CASES.length).toBeGreaterThan(0);
    expect(INDENTS.length).toBeGreaterThan(0);
  });
});
