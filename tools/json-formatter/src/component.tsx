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
import { formatJson, minifyJson, validateJson } from './utils.ts';

export function Component({ ctx }: { ctx: ToolContext }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);

  void ctx;

  const handleFormat = () => {
    const result = formatJson(input, indent);
    setOutput(result.output);
    setError(result.error);
  };

  const handleMinify = () => {
    const result = minifyJson(input);
    setOutput(result.output);
    setError(result.error);
  };

  const handleValidate = () => {
    const result = validateJson(input);
    setError(result.isValid ? null : result.error);
    if (result.isValid) {
      setOutput('Valid JSON');
    }
  };

  return (
    <div className="space-y-4">
      <ToolPanel title="JSON Formatter">
        <Tabs defaultValue="format">
          <TabsList>
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="minify">Minify</TabsTrigger>
            <TabsTrigger value="validate">Validate</TabsTrigger>
          </TabsList>
          <TabsContent value="format" className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Indent:</label>
              {[2, 4].map((n) => (
                <Button
                  key={n}
                  variant={indent === n ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setIndent(n)}
                >
                  {n} spaces
                </Button>
              ))}
            </div>
            <Button onClick={handleFormat}>Format JSON</Button>
          </TabsContent>
          <TabsContent value="minify">
            <Button onClick={handleMinify}>Minify JSON</Button>
          </TabsContent>
          <TabsContent value="validate">
            <Button onClick={handleValidate}>Validate JSON</Button>
          </TabsContent>
        </Tabs>
      </ToolPanel>

      <ToolInputOutput
        input={
          <ToolField label="Input">
            <CodeEditor
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
              language="json"
            />
          </ToolField>
        }
        output={
          <ToolField label="Output" actions={output ? <CopyButton value={output} /> : undefined}>
            <CodeEditor value={output} readOnly language="json" />
          </ToolField>
        }
      />

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
