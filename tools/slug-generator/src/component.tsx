import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CopyButton,
  Button,
  Switch,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@devtools/ui';
import { generateSlug, type SlugOptions } from './utils.ts';
import { Trash2 } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const savedOptions = ctx.useLive<SlugOptions>('options');

  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const [options, setOptions] = useState<SlugOptions>({
    separator: '-',
    lowercase: true,
    removeStopWords: false,
    trim: true,
    preserveCase: false,
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined && savedOptions !== undefined) {
        initialized.current = true;
        const curInput = savedInput || '';
        setInput(curInput);
        if (savedOptions) setOptions(savedOptions);
        if (curInput) {
          process(curInput, savedOptions || options);
        }
      }
    }
  }, [savedInput, savedOptions]);

  const process = (val: string, opts: SlugOptions) => {
    if (!val) {
      setOutput('');
      return;
    }
    const lines = val.split('\n');
    const slugs = lines.map((line) => generateSlug(line, opts));
    setOutput(slugs.join('\n'));
  };

  const handleInput = (val: string) => {
    setInput(val);
    void ctx.storage.set('input', val);
    process(val, options);
  };

  const updateOptions = (updates: Partial<SlugOptions>) => {
    const next = { ...options, ...updates };
    setOptions(next);
    void ctx.storage.set('options', next);
    process(input, next);
  };

  const textareaClass =
    'flex w-full rounded-md border border-input px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[400px] resize-y font-mono bg-card';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap gap-6 p-4 bg-card border rounded-lg">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Separator</label>
          <Select
            value={options.separator}
            onValueChange={(v) => updateOptions({ separator: v as '-' | '_' })}
          >
            <SelectTrigger className="w-24 border h-8 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-">Hyphen (-)</SelectItem>
              <SelectItem value="_">Underscore (_)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={options.lowercase}
            onCheckedChange={(v: boolean) => updateOptions({ lowercase: v })}
            id="slug-lowercase"
          />
          <label htmlFor="slug-lowercase" className="text-sm font-medium cursor-pointer">
            Force Lowercase
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={options.preserveCase}
            onCheckedChange={(v: boolean) =>
              updateOptions({ preserveCase: v, lowercase: v ? false : options.lowercase })
            }
            id="slug-preserve"
          />
          <label htmlFor="slug-preserve" className="text-sm font-medium cursor-pointer">
            Preserve Case
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Switch
            checked={options.removeStopWords}
            onCheckedChange={(v: boolean) => updateOptions({ removeStopWords: v })}
            id="slug-stopwords"
          />
          <label htmlFor="slug-stopwords" className="text-sm font-medium cursor-pointer">
            Remove Stop Words
          </label>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ToolField
          label="Input Text (one per line)"
          actions={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleInput('')}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" /> Clear
            </Button>
          }
        >
          <textarea
            value={input}
            onChange={(e: any) => handleInput(e.target.value)}
            className={textareaClass}
            placeholder="A very interesting article title"
          />
        </ToolField>

        <ToolField label="Generated Slugs" actions={<CopyButton value={output} />}>
          <textarea
            readOnly
            value={output}
            className={`${textareaClass} bg-muted/50`}
            placeholder="a-very-interesting-article-title"
          />
        </ToolField>
      </div>
    </div>
  );
}
