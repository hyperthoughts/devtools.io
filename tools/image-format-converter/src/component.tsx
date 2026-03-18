import { useState, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import {
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@devtools/ui';
import { convertImage, formatBytes, type ImageFormat } from './utils.ts';
import { Image as ImageIcon, Download, RefreshCw, Upload } from 'lucide-react';

export function Component({ ctx }: { ctx: ToolContext }) {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);

  const [format, setFormat] = useState<ImageFormat>('image/webp');
  const [quality, setQuality] = useState<number>(0.8);

  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);

  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);

      setOriginalFile(file);
      setOriginalUrl(URL.createObjectURL(file));

      setConvertedBlob(null);
      setConvertedUrl(null);
      setError(null);
    }
  };

  const handleSelectFile = () => fileInputRef.current?.click();

  const handleConvert = async () => {
    if (!originalFile) return;
    setIsConverting(true);
    setError(null);

    try {
      const blob = await convertImage(originalFile, format, quality);
      setConvertedBlob(blob);
      if (convertedUrl) URL.revokeObjectURL(convertedUrl);
      setConvertedUrl(URL.createObjectURL(blob));
    } catch (err: any) {
      setError(err.message || 'Failed to convert image');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (!convertedBlob || !originalFile || !ctx.filesystem) return;
    try {
      const ext = format.split('/')[1] === 'jpeg' ? 'jpg' : format.split('/')[1];
      const name = originalFile.name.replace(/\.[^/.]+$/, '');
      await ctx.filesystem.saveFile(convertedBlob, `${name}-converted.${ext}`);
    } catch {
      // ignore
    }
  };

  const formatList = [
    { value: 'image/png', label: 'PNG' },
    { value: 'image/jpeg', label: 'JPEG' },
    { value: 'image/webp', label: 'WEBP' },
    { value: 'image/bmp', label: 'BMP' },
  ];

  const supportsQuality = format === 'image/jpeg' || format === 'image/webp';

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-card p-6 rounded-2xl border flex-1 space-y-6 flex flex-col items-center justify-center text-center min-h-[300px] border-dashed">
          {originalUrl ? (
            <div className="space-y-4 w-full h-full flex flex-col items-center justify-center">
              <div className="relative group w-full max-w-[300px] max-h-[300px] flex items-center justify-center border rounded-lg overflow-hidden bg-muted/30 p-2">
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <p className="font-medium truncate max-w-[250px]">{originalFile?.name}</p>
                <p className="text-sm text-muted-foreground">
                  {originalFile ? formatBytes(originalFile.size) : ''}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleSelectFile}>
                Change Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4 max-w-sm cursor-pointer" onClick={handleSelectFile}>
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="font-medium text-lg">Upload an Image</h3>
              <p className="text-sm text-muted-foreground">
                Formats supported: PNG, JPG, WEBP, GIF, SVG, BMP and more.
              </p>
              <Button className="mt-4">Select File</Button>
            </div>
          )}
        </div>

        <div className="w-full md:w-[350px] shrink-0 space-y-6 flex flex-col">
          <div className="bg-card p-5 border rounded-2xl space-y-5">
            <h3 className="font-medium">Conversion Settings</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Format</label>
              <Select
                value={format}
                onValueChange={(v) => {
                  setFormat(v as ImageFormat);
                  setConvertedBlob(null);
                  setConvertedUrl(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formatList.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {supportsQuality && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Quality</label>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(quality * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setConvertedBlob(null);
                    setConvertedUrl(null);
                  }}
                  className="w-full"
                />
              </div>
            )}

            <Button
              className="w-full"
              disabled={!originalFile || isConverting}
              onClick={() => void handleConvert()}
            >
              {isConverting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <ImageIcon className="h-4 w-4 mr-2" />
              )}
              Convert Image
            </Button>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          {convertedUrl && convertedBlob && (
            <div className="bg-card p-5 border rounded-2xl space-y-5 flex-1 flex flex-col justify-between border-green-500/30 shadow-sm">
              <div className="space-y-4 text-center">
                <h3 className="font-medium text-green-600 dark:text-green-500">
                  Converted Successfully
                </h3>

                <div className="relative group w-full h-[150px] flex items-center justify-center border rounded-lg overflow-hidden bg-muted/30 p-2">
                  <img
                    src={convertedUrl}
                    alt="Converted"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    New Size:{' '}
                    <span className="font-medium text-foreground">
                      {formatBytes(convertedBlob.size)}
                    </span>
                  </p>
                  {originalFile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {convertedBlob.size < originalFile.size
                        ? `Reduced by ${Math.round((1 - convertedBlob.size / originalFile.size) * 100)}%`
                        : `Increased by ${Math.round((convertedBlob.size / originalFile.size - 1) * 100)}%`}
                    </p>
                  )}
                </div>
              </div>

              <Button onClick={() => void handleDownload()} variant="default" className="w-full">
                <Download className="h-4 w-4 mr-2" /> Download Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
