import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },

  lint: {
    options: { typeAware: true, typeCheck: true },
    ignorePatterns: ['dist/**', '*.generated.ts'],
  },

  fmt: {
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 2,
  },

  test: {
    coverage: {
      provider: 'v8',
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80,
      },
    },
  },

  run: {
    cache: { scripts: true, tasks: true },
    tasks: {
      'generate-registry': {
        command: 'tsx scripts/generate-registry.ts',
        input: [{ auto: true }, 'tools/*/package.json'],
        cache: true,
      },
      'create-tool': {
        command: 'tsx scripts/create-tool.ts',
        cache: false,
      },
    },
  },
});
