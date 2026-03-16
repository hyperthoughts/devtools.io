import { cpSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';
import { createInterface } from 'node:readline';

const ROOT = resolve(import.meta.dirname, '..');
const TEMPLATE_DIR = join(ROOT, 'tools', '_template');
const TOOLS_DIR = join(ROOT, 'tools');

async function prompt(question: string): Promise<string> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  if (!existsSync(TEMPLATE_DIR)) {
    console.error('Template directory not found at tools/_template');
    process.exit(1);
  }

  const name = await prompt('Tool name (kebab-case, e.g. url-encoder): ');
  if (!name || !/^[a-z][a-z0-9-]*$/.test(name)) {
    console.error('Invalid name. Use lowercase kebab-case.');
    process.exit(1);
  }

  const destDir = join(TOOLS_DIR, name);
  if (existsSync(destDir)) {
    console.error(`Tool ${name} already exists`);
    process.exit(1);
  }

  const displayName = await prompt('Display name (e.g. URL Encoder): ');
  const description = await prompt('Description: ');
  const category = await prompt(
    'Category (formatters|encoders|generators|analyzers|converters|validators|network|crypto|text|media): ',
  );

  cpSync(TEMPLATE_DIR, destDir, { recursive: true });

  const pkgPath = join(destDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  pkg.name = `@devtools/${name}`;
  pkg.devtools.name = displayName || name;
  pkg.devtools.description = description || '';
  pkg.devtools.category = category || 'formatters';
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

  console.log(`\nCreated tool at tools/${name}`);
  console.log('Running generate-registry...');
  execSync('vp exec tsx scripts/generate-registry.ts', {
    cwd: ROOT,
    stdio: 'inherit',
  });
  console.log(`\nDone! Run "vp install" then start developing.`);
}

void main();
