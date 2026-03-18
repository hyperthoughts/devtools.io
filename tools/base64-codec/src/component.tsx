import { useState } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  Button,
  CodeEditor,
  CopyButton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ToolPanel,
  ToolInputOutput,
  ToolField,
} from '@devtools/ui';
import { encodeBase64, decodeBase64, type Base64Mode } from './utils.ts';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('lastInput');
  const [input, setInput] = useState(savedInput ?? '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<Base64Mode>('standard');

  const saveInput = (value: string) => {
    setInput(value);
    void ctx.storage.set('lastInput', value);
  };

  const handleEncode = () => {
    const result = encodeBase64(input, mode);
    setOutput(result.output);
    setError(result.error);
  };

  const handleDecode = () => {
    const result = decodeBase64(input, mode);
    setOutput(result.output);
    setError(result.error);
  };

  return (
    <div className="space-y-4">
      <ToolPanel title="Base64 Codec">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Mode:</label>
            <Button
              variant={mode === 'standard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('standard')}
            >
              Standard
            </Button>
            <Button
              variant={mode === 'url-safe' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMode('url-safe')}
            >
              URL-Safe
            </Button>
          </div>
          <Tabs defaultValue="encode">
            <TabsList>
              <TabsTrigger value="encode">Encode</TabsTrigger>
              <TabsTrigger value="decode">Decode</TabsTrigger>
            </TabsList>
            <TabsContent value="encode">
              <Button onClick={handleEncode}>Encode to Base64</Button>
            </TabsContent>
            <TabsContent value="decode">
              <Button onClick={handleDecode}>Decode from Base64</Button>
            </TabsContent>
          </Tabs>
        </div>
      </ToolPanel>

      <ToolInputOutput
        input={
          <ToolField label="Input">
            <CodeEditor
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => saveInput(e.target.value)}
              placeholder="Enter text or Base64 string..."
            />
          </ToolField>
        }
        output={
          <ToolField label="Output" actions={output ? <CopyButton value={output} /> : undefined}>
            <CodeEditor value={output} readOnly />
          </ToolField>
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
