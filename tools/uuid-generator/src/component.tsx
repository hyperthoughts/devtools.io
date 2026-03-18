import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CodeEditor,
  CopyButton,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Input,
  Switch,
} from '@devtools/ui';
import { generateIds, type IdType, type GeneratedId } from './utils.ts';
import { RefreshCw } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedType = ctx.useLive<IdType>('idType');
  const savedCount = ctx.useLive<number>('count');
  const savedUpper = ctx.useLive<boolean>('uppercase');

  const [idType, setIdType] = useState<IdType>('uuid-v4');
  const [count, setCount] = useState<number>(1);
  const [uppercase, setUppercase] = useState(false);
  const [results, setResults] = useState<GeneratedId[]>([]);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedType !== undefined) {
        initialized.current = true;
        setIdType(savedType || 'uuid-v4');
        setCount(savedCount || 1);
        setUppercase(savedUpper || false);
      }
    }
  }, [savedType, savedCount, savedUpper]);

  const updatePreferences = (t: IdType, c: number, u: boolean) => {
    setIdType(t);
    setCount(c);
    setUppercase(u);
    void ctx.storage.set('idType', t);
    void ctx.storage.set('count', c);
    void ctx.storage.set('uppercase', u);
  };

  const handleGenerate = () => {
    const generated = generateIds(idType, count);
    if (uppercase) {
      generated.forEach((x) => {
        x.value = x.value.toUpperCase();
      });
    }
    setResults(generated);
  };

  // Generate on first boot
  useEffect(() => {
    if (results.length === 0 && initialized.current) {
      handleGenerate();
    }
  }, [initialized.current]);

  const outputText = results.map((r) => r.value).join('\n');

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3 rounded-lg border bg-card p-4">
        <ToolField label="Type">
          <Select
            value={idType}
            onValueChange={(val) => updatePreferences(val as IdType, count, uppercase)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="uuid-v4">UUID v4 (Random)</SelectItem>
              <SelectItem value="uuid-v7">UUID v7 (Time-based)</SelectItem>
              <SelectItem value="ulid">ULID (Lexicographical)</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>
        <ToolField label="Quantity">
          <Input
            type="number"
            min={1}
            max={10000}
            value={count}
            onChange={(e) => updatePreferences(idType, Number(e.target.value) || 1, uppercase)}
          />
        </ToolField>
        <div className="flex flex-col justify-end space-y-2">
          <div className="flex items-center space-x-2 pb-2">
            <Switch
              id="uppercase-switch"
              checked={uppercase}
              onCheckedChange={(checked) => updatePreferences(idType, count, checked)}
            />
            <label htmlFor="uppercase-switch" className="text-sm font-medium">
              Uppercase
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Generated Outputs</h3>
          <Button onClick={handleGenerate} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Generate New
          </Button>
        </div>

        <ToolField label="" actions={<CopyButton value={outputText} />}>
          <CodeEditor value={outputText} readOnly className="min-h-[300px] font-mono break-all" />
        </ToolField>
      </div>

      {results.length > 0 && results[0].timestamp && (
        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
          <p className="font-semibold mb-2">Timestamp Extraction</p>
          <p>
            {idType === 'uuid-v7' ? 'UUID v7' : 'ULID'} encodes a timestamp. The timestamp of the
            first generated ID above is:{' '}
            <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-foreground">
              {new Date(results[0].timestamp).toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
