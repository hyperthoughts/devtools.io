import { useState, useEffect, useRef, useCallback } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  ToolField,
  CodeEditor,
  CopyButton,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  FileDropZone,
} from '@devtools/ui';
import { generateQr, scanQrFromFile } from './utils.ts';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const savedTab = ctx.useLive<'generate' | 'decode'>('activeTab');

  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState<'generate' | 'decode'>('generate');

  const [qrUrl, setQrUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const [decodeResult, setDecodeResult] = useState('');
  const [decodeError, setDecodeError] = useState<string | null>(null);

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined) {
        initialized.current = true;
        setInput(savedInput || '');
        if (savedTab) setActiveTab(savedTab);
      }
    }
  }, [savedInput, savedTab]);

  const saveInput = (value: string) => {
    setInput(value);
    void ctx.storage.set('input', value);
  };

  const handleTabChange = (val: string) => {
    setActiveTab(val as any);
    void ctx.storage.set('activeTab', val);
  };

  // Generate QR internally when input changes
  useEffect(() => {
    if (activeTab === 'generate' && input.trim()) {
      generateQr(input)
        .then((url) => {
          setQrUrl(url);
          setError(null);
        })
        .catch((e) => setError(e.message));
    } else {
      setQrUrl('');
      setError(null);
    }
  }, [input, activeTab]);

  const handleDownloadQr = () => {
    if (!ctx.filesystem || !qrUrl) return;

    // Convert data:image/png;base64 into blob
    fetch(qrUrl)
      .then((res) => res.blob())
      .then((blob) => ctx.filesystem!.saveFile(blob, 'qrcode.png'))
      .catch(console.error);
  };

  const handleFileDrop = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    const file = files[0];
    setDecodeError(null);
    setDecodeResult('');
    try {
      const data = await scanQrFromFile(file);
      setDecodeResult(data);
    } catch (e: any) {
      setDecodeError(
        e.message || 'Failed to decode QR code. Ensure it is clear and has good contrast.',
      );
    }
  }, []);

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="generate">Generate QR</TabsTrigger>
          <TabsTrigger value="decode">Decode QR</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <ToolField label="Text or URL to encode">
                <CodeEditor
                  value={input}
                  onChange={(e) => saveInput(e.target.value)}
                  placeholder="https://devtools.io"
                  className="min-h-[250px]"
                />
              </ToolField>
            </div>

            <div className="space-y-4">
              <ToolField
                label="Generated QR Code"
                actions={
                  qrUrl && ctx.filesystem ? (
                    <Button variant="secondary" size="sm" onClick={handleDownloadQr}>
                      Download
                    </Button>
                  ) : undefined
                }
              >
                <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/20 min-h-[300px] p-6 relative">
                  {error && <div className="text-sm text-destructive absolute top-4">{error}</div>}
                  {qrUrl ? (
                    <img
                      src={qrUrl}
                      alt="QR Code"
                      className="w-48 h-48 sm:w-64 sm:h-64 rounded-md shadow bg-white"
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm flex flex-col items-center gap-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="5" height="5" x="3" y="3" rx="1" />
                        <rect width="5" height="5" x="16" y="3" rx="1" />
                        <rect width="5" height="5" x="3" y="16" rx="1" />
                        <path d="M21 16h-3a2 2 0 0 0-2 2v3" />
                        <path d="M21 21v.01" />
                        <path d="M12 7v3a2 2 0 0 1-2 2H7" />
                        <path d="M3 12h.01" />
                        <path d="M12 3h.01" />
                        <path d="M12 16v.01" />
                        <path d="M16 12h1" />
                        <path d="M21 12v.01" />
                        <path d="M12 21v-1" />
                      </svg>
                      Enter text to generate QR code
                    </div>
                  )}
                </div>
              </ToolField>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="decode" className="space-y-4">
          <FileDropZone
            onDrop={handleFileDrop}
            accept={['image/jpeg', 'image/png', 'image/webp']}
          />
          {decodeError && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
              {decodeError}
            </div>
          )}
          {decodeResult && (
            <ToolField label="Decoded Output" actions={<CopyButton value={decodeResult} />}>
              <CodeEditor
                value={decodeResult}
                readOnly
                className="min-h-[150px] font-mono break-all"
              />
            </ToolField>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
