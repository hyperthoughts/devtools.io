# devtools.io Constitution

## Plugin Standards

- Every tool MUST export a default ToolDefinition from src/index.ts
- Every tool MUST declare contractVersion matching TOOL_CONTRACT_VERSION
- Every tool MUST have a **tests**/ directory with at least one test per exported function
- Pure logic MUST live in src/utils.ts, separated from React components
- Tools MUST NOT import from other tools -- only from @devtools/\* packages
- Tools MUST declare capabilities honestly -- don't set needsWorker: true unless you use workers

## Testing

- All packages require >= 80% statement coverage
- Worker logic must be testable without actual web workers (mock contracts)
- Storage logic must be testable with in-memory Dexie (fake-indexeddb)
- Use createMockToolContext() from @devtools/core/testing in component tests

## Code Style

- Enforced by Oxlint and Oxfmt via vp check -- no separate config files
- Single quotes, trailing commas
- Strict TypeScript -- no any, no implicit returns
- Use type imports when only importing types

## Architecture

- Monorepo with pnpm workspaces: apps/, packages/, tools/
- Shell app in apps/shell/ -- the main entry point
- Shared packages: core, storage, workers, filesystem, ui
- Each tool is a separate workspace package in tools/
- All tooling via vp CLI (Vite+): vp dev, vp build, vp test, vp check

## Workflow

- Run vp install after pulling remote changes
- Run vp check and vp test to validate changes
- Run generate-registry after adding or modifying tools
- Use vp run create-tool to scaffold new tools from \_template
