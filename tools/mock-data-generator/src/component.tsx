import { useState, useRef, useEffect } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CodeEditor,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  CopyButton,
  Input,
} from '@devtools/ui';
import { FIELD_TYPES } from './utils.ts';
import type { WorkerAPI, MockField, MockFieldType } from './worker.ts';
import { RefreshCw, Download, Plus, Trash2 } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const worker = ctx.worker as {
    run: <T>(fn: (api: WorkerAPI) => Promise<T>) => Promise<T>;
  } | null;

  const savedFields = ctx.useLive<MockField[]>('fields');
  const savedCount = ctx.useLive<number>('count');

  const [fields, setFields] = useState<MockField[]>([
    { name: 'id', type: 'uuid' },
    { name: 'name', type: 'fullName' },
    { name: 'email', type: 'email' },
  ]);
  const [count, setCount] = useState<number>(10);

  const [output, setOutput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedFields !== undefined && savedCount !== undefined) {
        initialized.current = true;
        const currentFields = savedFields || fields;
        const currentCount = savedCount || count;
        setFields(currentFields);
        setCount(currentCount);
        void generateData(currentFields, currentCount);
      }
    }
  }, [savedFields, savedCount]);

  const updateFields = (newFields: MockField[]) => {
    setFields(newFields);
    void ctx.storage.set('fields', newFields);
  };

  const updateCount = (newCount: number) => {
    setCount(newCount);
    void ctx.storage.set('count', newCount);
  };

  const addField = () => {
    updateFields([...fields, { name: `field${fields.length + 1}`, type: 'word' }]);
  };

  const removeField = (index: number) => {
    updateFields(fields.filter((_, i) => i !== index));
  };

  const changeFieldName = (index: number, name: string) => {
    const newFields = [...fields];
    newFields[index].name = name;
    updateFields(newFields);
  };

  const changeFieldType = (index: number, type: MockFieldType) => {
    const newFields = [...fields];
    newFields[index].type = type;
    updateFields(newFields);
  };

  const generateData = async (flds = fields, cnt = count) => {
    if (!worker || flds.length === 0) {
      setOutput('[]');
      return;
    }
    setIsGenerating(true);
    try {
      const data = await worker.run((api) => api.generateData(flds, cnt));
      setOutput(JSON.stringify(data, null, 2));
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to generate data');
      setOutput('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveFile = async () => {
    try {
      if (!ctx.filesystem) return;
      await ctx.filesystem.saveFile(
        new Blob([output], { type: 'application/json' }),
        'mock-data.json',
      );
    } catch {
      // User cancelled
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[400px_1fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Schema</h3>
            <div className="flex items-center gap-2">
              <Select value={String(count)} onValueChange={(v) => updateCount(parseInt(v, 10))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 Rows</SelectItem>
                  <SelectItem value="50">50 Rows</SelectItem>
                  <SelectItem value="100">100 Rows</SelectItem>
                  <SelectItem value="1000">1000 Rows</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-auto border rounded-xl p-4 bg-card">
            {fields.map((field, index) => (
              <div key={index} className="flex flex-col gap-2 p-3 border rounded-lg bg-background">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Field {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeField(index)}
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={field.name}
                  onChange={(e) => changeFieldName(index, e.target.value)}
                  placeholder="Field Name"
                  className="h-8"
                />
                <Select
                  value={field.type}
                  onValueChange={(v) => changeFieldType(index, v as MockFieldType)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((ft) => (
                      <SelectItem key={ft.value} value={ft.value}>
                        {ft.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}

            <Button variant="outline" className="w-full mt-4 border-dashed" onClick={addField}>
              <Plus className="h-4 w-4 mr-2" /> Add Field
            </Button>
          </div>

          <Button
            className="w-full"
            onClick={() => void generateData(fields, count)}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Generate Data
          </Button>
        </div>

        <ToolField
          label="Generated Data (JSON)"
          actions={
            <div className="flex items-center gap-2">
              <CopyButton value={output} />
              <Button variant="ghost" size="sm" onClick={handleSaveFile}>
                <Download className="h-4 w-4 mr-2" /> Save Formatted API
              </Button>
            </div>
          }
        >
          {error ? (
            <div className="p-4 bg-destructive/10 text-destructive rounded border min-h-[500px]">
              {error}
            </div>
          ) : (
            <CodeEditor value={output} readOnly language="json" className="min-h-[500px]" />
          )}
        </ToolField>
      </div>
    </div>
  );
}
