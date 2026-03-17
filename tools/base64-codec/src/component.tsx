import { useState } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  CodeEditor,
  CopyButton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
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
      <Card>
        <CardHeader>
          <CardTitle>Base64 Codec</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Input</label>
          <CodeEditor
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => saveInput(e.target.value)}
            placeholder="Enter text or Base64 string..."
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            {output && <CopyButton value={output} />}
          </div>
          <CodeEditor value={output} readOnly />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
