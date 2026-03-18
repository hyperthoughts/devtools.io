import { useState, useEffect } from 'react';
import type { ToolContext } from '@devtools/core';
import { Input, Button } from '@devtools/ui';
import { compressImage, formatBytes, createObjectURL, type CompressOptions } from './utils.ts';
import { Upload, Download, RefreshCw, GripHorizontal } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [compressedPreviewUrl, setCompressedPreviewUrl] = useState<string | null>(null);

  const [isCompressing, setIsCompressing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const savedOptions = ctx.useLive<Partial<CompressOptions>>('options');
  const [options, setOptions] = useState<CompressOptions>({
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    initialQuality: 0.8,
  });

  useEffect(() => {
    if (savedOptions) {
      setOptions((prev) => ({ ...prev, ...savedOptions }));
    }
  }, [savedOptions]);

  const updateOptions = (updates: Partial<CompressOptions>) => {
    const next = { ...options, ...updates };
    setOptions(next);
    void ctx.storage.set('options', next);
  };

  const handleOpenFile = async () => {
    try {
      if (!ctx.filesystem) return;
      const f = await ctx.filesystem.openFile({
        accept: ['.jpg', '.jpeg', '.png', '.webp', 'image/*'],
      });
      if (f && !Array.isArray(f)) {
        const fileObj = f as unknown as File;
        setFile(fileObj);
        setCompressedFile(null);
        setError(null);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(createObjectURL(fileObj));
      }
    } catch {
      // User cancelled
    }
  };

  const handleSelectOriginDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      setFile(f);
      setCompressedFile(null);
      setError(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(createObjectURL(f));
    }
  };

  const processCompression = async () => {
    if (!file) return;
    setIsCompressing(true);
    setError(null);
    try {
      const cFile = await compressImage(file, options);
      setCompressedFile(cFile);
      if (compressedPreviewUrl) URL.revokeObjectURL(compressedPreviewUrl);
      setCompressedPreviewUrl(createObjectURL(cFile));
    } catch (err: any) {
      setError(err.message || 'Error occurred during compression');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveFile = async () => {
    try {
      if (!ctx.filesystem || !compressedFile) return;
      await ctx.filesystem.saveFile(compressedFile, `compressed-${compressedFile.name}`);
    } catch {
      // User cancelled
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (compressedPreviewUrl) URL.revokeObjectURL(compressedPreviewUrl);
    };
  }, [previewUrl, compressedPreviewUrl]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive rounded font-medium">{error}</div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-6">
          <div className="bg-card p-4 rounded-xl border space-y-4">
            <h3 className="font-medium">Compression Settings</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Max Size (MB)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={options.maxSizeMB}
                    onChange={(e) => updateOptions({ maxSizeMB: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm text-right font-mono">{options.maxSizeMB}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Max Width or Height (px)</label>
                <Input
                  type="number"
                  value={options.maxWidthOrHeight}
                  onChange={(e) =>
                    updateOptions({ maxWidthOrHeight: parseInt(e.target.value, 10) || 1920 })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Initial Quality (0 to 1)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={options.initialQuality}
                    onChange={(e) => updateOptions({ initialQuality: parseFloat(e.target.value) })}
                    className="flex-1"
                  />
                  <span className="w-12 text-sm text-right font-mono">
                    {options.initialQuality}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full h-12 text-lg"
            disabled={!file || isCompressing}
            onClick={() => void processCompression()}
          >
            {isCompressing ? (
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <GripHorizontal className="mr-2 h-5 w-5" />
            )}
            Compress Image
          </Button>
        </div>

        <div className="md:col-span-2 grid gap-6 grid-cols-1 sm:grid-cols-2">
          <div className="space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Original</h3>
              {file && (
                <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                  {formatBytes(file.size)}
                </span>
              )}
            </div>

            <div className="flex-1 border-2 border-dashed rounded-xl overflow-hidden flex items-center justify-center bg-muted/30 relative min-h-[300px]">
              {previewUrl ? (
                <>
                  <div className="absolute inset-0 z-0 p-2">
                    <img
                      src={previewUrl}
                      className="w-full h-full object-contain pointer-events-none opacity-90"
                      alt="Original"
                    />
                  </div>
                  <div className="absolute inset-0 z-10 hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 group">
                    <Button
                      variant="secondary"
                      className="group-hover:scale-105 transition-transform"
                      onClick={() => void handleOpenFile()}
                    >
                      <Upload className="h-4 w-4 mr-2" /> Replace
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 w-full flex flex-col items-center">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">Select an image to compress</p>

                  <label className="cursor-pointer">
                    <div className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2">
                      Browse Files
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleSelectOriginDrop}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="font-medium flex items-center gap-2">
                Compressed
                {file && compressedFile && (
                  <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full font-medium">
                    {Math.round((1 - compressedFile.size / file.size) * 100)}% smaller
                  </span>
                )}
              </h3>
              {compressedFile && (
                <span className="text-sm text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                  {formatBytes(compressedFile.size)}
                </span>
              )}
            </div>

            <div className="flex-1 border rounded-xl overflow-hidden flex items-center justify-center bg-card relative min-h-[300px]">
              {isCompressing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                  <RefreshCw className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-sm font-medium animate-pulse">Compressing...</p>
                </div>
              )}

              {!isCompressing && compressedPreviewUrl ? (
                <>
                  <div className="absolute inset-0 z-0 p-2">
                    <img
                      src={compressedPreviewUrl}
                      className="w-full h-full object-contain pointer-events-none"
                      alt="Compressed"
                    />
                  </div>
                  <div className="absolute bottom-4 right-4 z-10 w-full flex justify-end px-4">
                    <Button
                      onClick={() => void handleSaveFile()}
                      className="shadow-lg hover:scale-105 transition-transform"
                    >
                      <Download className="h-4 w-4 mr-2" /> Save Image
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 text-muted-foreground">
                  <GripHorizontal className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Compressed image will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
