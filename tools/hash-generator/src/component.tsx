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
  FileDropZone,
} from '@devtools/ui';
import { hashString, hashFile, type HashAlgorithm, type HashResult } from './utils.ts';

const ALGORITHMS: HashAlgorithm[] = ['SHA-256', 'SHA-1', 'MD5'];

export function Component({ ctx }: { ctx: ToolContext }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<HashResult[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [computing, setComputing] = useState(false);

  void ctx;

  const handleHashText = async () => {
    if (!input.trim()) return;
    setComputing(true);
    setFileName(null);
    const hashes = await Promise.all(ALGORITHMS.map((alg) => hashString(input, alg)));
    setResults(hashes);
    setComputing(false);
  };

  const handleFileDrop = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setComputing(true);
    setFileName(file.name);
    setInput('');
    const hashes = await Promise.all(ALGORITHMS.map((alg) => hashFile(file, alg)));
    setResults(hashes);
    setComputing(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Hash Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Text Input</label>
            <CodeEditor
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
              placeholder="Enter text to hash..."
            />
            <Button onClick={handleHashText} disabled={computing}>
              {computing ? 'Computing...' : 'Hash Text'}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <FileDropZone onDrop={handleFileDrop}>
            <p className="text-sm text-muted-foreground">
              {fileName ? `Hashed: ${fileName}` : 'Drop a file here to hash it'}
            </p>
          </FileDropZone>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map((result) => (
              <div key={result.algorithm} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{result.algorithm}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {result.duration.toFixed(1)}ms
                    </span>
                    <CopyButton value={result.hash} />
                  </div>
                </div>
                <code className="block break-all rounded bg-muted px-2 py-1 font-mono text-xs">
                  {result.hash}
                </code>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
