import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

interface DevToolsMeta {
  name: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
}

interface RegistryEntry {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  version: string;
  source: 'builtin' | 'community';
}

const ROOT = resolve(import.meta.dirname, '..');
const TOOLS_DIR = join(ROOT, 'tools');
const REGISTRY_OUT = join(ROOT, 'apps', 'shell', 'src', 'registry');

function main() {
  const entries: RegistryEntry[] = [];
  const imports: Record<string, string> = {};

  if (!existsSync(TOOLS_DIR)) {
    console.log('No tools/ directory found, writing empty registry');
    writeOutput(entries, imports);
    return;
  }

  const toolDirs = readdirSync(TOOLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name)
    .sort();

  for (const toolDir of toolDirs) {
    const pkgPath = join(TOOLS_DIR, toolDir, 'package.json');
    if (!existsSync(pkgPath)) continue;

    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const meta: DevToolsMeta | undefined = pkg.devtools;
    if (!meta) {
      console.warn(`Skipping ${toolDir}: no devtools field in package.json`);
      continue;
    }

    entries.push({
      id: toolDir,
      name: meta.name,
      description: meta.description,
      icon: meta.icon,
      category: meta.category,
      tags: meta.tags ?? [],
      version: pkg.version ?? '0.0.0',
      source: 'builtin',
    });

    imports[toolDir] = pkg.name;
  }

  writeOutput(entries, imports);
}

function writeOutput(entries: RegistryEntry[], imports: Record<string, string>) {
  if (!existsSync(REGISTRY_OUT)) {
    mkdirSync(REGISTRY_OUT, { recursive: true });
  }

  const registryJson = JSON.stringify({ tools: entries }, null, 2);
  writeFileSync(join(REGISTRY_OUT, 'registry.json'), registryJson + '\n');
  console.log(`Generated registry.json with ${entries.length} tools`);

  const importLines = Object.entries(imports)
    .map(([id, pkg]) => `  '${id}': () => import('${pkg}'),`)
    .join('\n');

  const importFile = `import type { ToolDefinition } from '@devtools/core'

export const toolImports: Record<string, () => Promise<{ default: ToolDefinition }>> = {
${importLines}
}
`;
  writeFileSync(join(REGISTRY_OUT, 'tool-imports.generated.ts'), importFile);
  console.log(`Generated tool-imports.generated.ts`);
}

main();
