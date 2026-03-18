import { useState } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolPanel, ToolInputOutput, ToolField, CodeEditor, CopyButton } from '@devtools/ui';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('lastInput');
  const [input, setInput] = useState('');
  const [output, _setOutput] = useState('');

  if (savedInput !== undefined && input === '') {
    setInput(savedInput);
  }

  const saveInput = (value: string) => {
    setInput(value);
    void ctx.storage.set('lastInput', value);
  };

  return (
    <div className="space-y-4">
      <ToolPanel title="Tool Name">
        <p className="text-sm text-muted-foreground">Configure your tool here.</p>
      </ToolPanel>
      <ToolInputOutput
        input={
          <ToolField label="Input">
            <CodeEditor
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => saveInput(e.target.value)}
              placeholder="Enter input..."
            />
          </ToolField>
        }
        output={
          <ToolField label="Output" actions={output ? <CopyButton value={output} /> : undefined}>
            <CodeEditor value={output} readOnly />
          </ToolField>
        }
      />
    </div>
  );
}
