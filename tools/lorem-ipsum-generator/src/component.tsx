import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CodeEditor,
  CopyButton,
  Button,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
} from '@devtools/ui';
import { generateLorem, type LoremUnit, type LoremOptions } from './utils.ts';
import { RefreshCw } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedOptions = ctx.useLive<LoremOptions>('options');

  const [options, setOptions] = useState<LoremOptions>({
    count: 3,
    unit: 'paragraphs',
    startWithLorem: true,
    htmlMode: false,
  });
  const [output, setOutput] = useState('');

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedOptions !== undefined) {
        initialized.current = true;
        const opts = savedOptions || options;
        setOptions(opts);
        setOutput(generateLorem(opts));
      }
    }
  }, [savedOptions]);

  const updateOptions = (updates: Partial<LoremOptions>) => {
    const next = { ...options, ...updates };
    setOptions(next);
    void ctx.storage.set('options', next);
    setOutput(generateLorem(next));
  };

  const handleRegenerate = () => {
    setOutput(generateLorem(options));
  };

  // Generate on first mount if not loaded from storage
  useEffect(() => {
    if (initialized.current && !output) {
      handleRegenerate();
    }
  }, [initialized.current, output]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 rounded-lg border bg-card p-4">
        <ToolField label="Type">
          <Select
            value={options.unit}
            onValueChange={(val) => updateOptions({ unit: val as LoremUnit })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraphs">Paragraphs</SelectItem>
              <SelectItem value="sentences">Sentences</SelectItem>
              <SelectItem value="words">Words</SelectItem>
            </SelectContent>
          </Select>
        </ToolField>

        <ToolField label="Quantity">
          <Input
            type="number"
            min={1}
            max={options.unit === 'words' ? 10000 : 100}
            value={options.count}
            onChange={(e) => updateOptions({ count: parseInt(e.target.value, 10) || 1 })}
          />
        </ToolField>

        <div className="flex flex-col justify-end space-y-4 pb-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="start-lorem"
              checked={options.startWithLorem}
              onCheckedChange={(c) => updateOptions({ startWithLorem: c })}
            />
            <label htmlFor="start-lorem" className="text-sm font-medium">
              Start with "Lorem ipsum..."
            </label>
          </div>
        </div>

        <div className="flex flex-col justify-end space-y-4 pb-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="html-mode"
              checked={options.htmlMode}
              onCheckedChange={(c) => updateOptions({ htmlMode: c })}
            />
            <label htmlFor="html-mode" className="text-sm font-medium">
              Wrap in HTML tags
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Generated Text</h3>
          <Button onClick={handleRegenerate} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Regenerate
          </Button>
        </div>

        <ToolField label="" actions={<CopyButton value={output} />}>
          <CodeEditor
            value={output}
            readOnly
            language={options.htmlMode ? 'html' : 'plaintext'}
            className="min-h-[400px] text-base"
          />
        </ToolField>
      </div>
    </div>
  );
}
