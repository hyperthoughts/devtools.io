import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolInputOutput,
  ToolField,
  CodeEditor,
  CopyButton,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Switch,
  Input,
} from '@devtools/ui';
import { parseUrl } from './utils.ts';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const savedMode = ctx.useLive<'component' | 'full'>('mode');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'component' | 'full'>('component');
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined) {
        initialized.current = true;
        setInput(savedInput || '');
        if (savedMode) setMode(savedMode);
      }
    }
  }, [savedInput, savedMode]);

  const saveInput = (value: string) => {
    setInput(value);
    void ctx.storage.set('input', value);
  };

  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'full' : 'component';
    setMode(newMode);
    void ctx.storage.set('mode', newMode);
  };

  const encode = () => {
    try {
      setOutput(mode === 'component' ? encodeURIComponent(input) : encodeURI(input));
    } catch (e: any) {
      setOutput('Error: ' + e.message);
    }
  };

  const decode = () => {
    try {
      setOutput(mode === 'component' ? decodeURIComponent(input) : decodeURI(input));
    } catch (e: any) {
      setOutput('Error: ' + e.message);
    }
  };

  // Parser state
  const parsed = parseUrl(input);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="codec">
        <TabsList className="mb-4">
          <TabsTrigger value="codec">Encode / Decode</TabsTrigger>
          <TabsTrigger value="parser">URL Parser</TabsTrigger>
        </TabsList>

        <TabsContent value="codec" className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg border bg-card p-4">
            <Switch checked={mode === 'full'} onCheckedChange={handleModeChange} />
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Encode Full URL</label>
              <p className="text-xs text-muted-foreground">
                {mode === 'full'
                  ? 'Uses encodeURI (preserves special characters like ? / & =)'
                  : 'Uses encodeURIComponent (encodes everything, best for query parameters)'}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              <Button onClick={decode} variant="secondary">
                Decode
              </Button>
              <Button onClick={encode}>Encode</Button>
            </div>
          </div>

          <ToolInputOutput
            input={
              <ToolField label="Input">
                <CodeEditor
                  value={input}
                  onChange={(e) => saveInput(e.target.value)}
                  placeholder="Enter URL or component..."
                  className="min-h-[200px]"
                />
              </ToolField>
            }
            output={
              <ToolField
                label="Output"
                actions={output ? <CopyButton value={output} /> : undefined}
              >
                <CodeEditor value={output} readOnly className="min-h-[200px]" />
              </ToolField>
            }
          />
        </TabsContent>

        <TabsContent value="parser" className="space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <ToolField label="URL to Parse">
              <Input
                value={input}
                onChange={(e) => saveInput(e.target.value)}
                placeholder="https://example.com/path?key=value#hash"
                className="font-mono text-sm mt-2"
              />
            </ToolField>
          </div>

          {parsed.valid ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">URL Components</h3>
                <div className="rounded-lg border bg-card p-0 divide-y">
                  {[
                    { label: 'Protocol', value: parsed.protocol },
                    { label: 'Host', value: parsed.host },
                    { label: 'Port', value: parsed.port || '(default)' },
                    { label: 'Pathname', value: parsed.pathname },
                    { label: 'Hash Fragment', value: parsed.hash },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between p-3 items-center">
                      <span className="text-sm font-medium text-muted-foreground w-28 shrink-0">
                        {item.label}
                      </span>
                      <span className="text-sm font-mono truncate mr-2 flex-1 text-right">
                        {item.value}
                      </span>
                      <CopyButton value={item.value || ''} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">
                  Search Parameters ({parsed.searchParams?.length || 0})
                </h3>
                {parsed.searchParams && parsed.searchParams.length > 0 ? (
                  <div className="rounded-lg border bg-card divide-y">
                    {parsed.searchParams.map((param, i) => (
                      <div key={i} className="flex flex-col gap-1 p-3">
                        <div className="flex justify-between items-center w-full">
                          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            {param.key}
                          </span>
                          <CopyButton value={param.value} />
                        </div>
                        <span className="text-sm font-mono break-all mt-1">{param.value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                    No query parameters found.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-8 text-center text-sm text-destructive">
              Please enter a valid, absolute URL to parse its components.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
