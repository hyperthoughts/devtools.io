import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CopyButton, Button } from '@devtools/ui';
import { convertCase, type CaseType } from './utils.ts';
import { FileUp, Download } from 'lucide-react';

const CASES: { value: CaseType; label: string; example: string }[] = [
  { value: 'lowercase', label: 'lowercase', example: 'hello world' },
  { value: 'uppercase', label: 'UPPERCASE', example: 'HELLO WORLD' },
  { value: 'camelCase', label: 'camelCase', example: 'helloWorld' },
  { value: 'PascalCase', label: 'PascalCase', example: 'HelloWorld' },
  { value: 'snake_case', label: 'snake_case', example: 'hello_world' },
  { value: 'CONSTANT_CASE', label: 'CONSTANT_CASE', example: 'HELLO_WORLD' },
  { value: 'kebab-case', label: 'kebab-case', example: 'hello-world' },
  { value: 'dot.case', label: 'dot.case', example: 'hello.world' },
  { value: 'path/case', label: 'path/case', example: 'hello/world' },
  { value: 'Title Case', label: 'Title Case', example: 'Hello World' },
  { value: 'Sentence case', label: 'Sentence case', example: 'Hello world' },
];

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const [input, setInput] = useState('');

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined && savedInput !== '') {
        initialized.current = true;
        setInput(savedInput);
      }
    }
  }, [savedInput]);

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const file = await ctx.filesystem.openFile({ accept: ['.txt', '*/*'] });
      if (file && !Array.isArray(file)) {
        const text = await file.text();
        handleInput(text);
      }
    } catch {
      // User cancelled
    }
  };

  const handleSaveFile = async (data: string) => {
    try {
      if (!ctx.filesystem) return;
      await ctx.filesystem.saveFile(new Blob([data], { type: 'text/plain' }), 'converted-case.txt');
    } catch {
      // User cancelled
    }
  };

  const textareaClass =
    'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label="Input Text"
          actions={
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleInput('')}>
                Clear
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void handleOpenFile()}>
                <FileUp className="h-4 w-4 mr-2" /> Load
              </Button>
            </div>
          }
        >
          <textarea
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            className={`${textareaClass} min-h-[500px] max-h-[800px] resize-y font-mono`}
            placeholder="Enter text to convert (e.g., hello world)"
          />
        </ToolField>

        <div className="space-y-4 h-[540px] overflow-auto pr-2 pb-4">
          {CASES.map((c) => {
            const converted = convertCase(input, c.value);
            return (
              <ToolField
                key={c.value}
                label={c.label}
                actions={
                  <div className="flex items-center gap-1">
                    {converted && <CopyButton value={converted} />}
                    {converted && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => void handleSaveFile(converted)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                }
              >
                <div className="relative">
                  <textarea
                    readOnly
                    value={converted}
                    placeholder={c.example}
                    className={`${textareaClass} h-[80px] resize-none font-mono bg-muted/50`}
                  />
                </div>
              </ToolField>
            );
          })}
        </div>
      </div>
    </div>
  );
}
