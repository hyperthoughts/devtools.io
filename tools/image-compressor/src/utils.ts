import imageCompression from 'browser-image-compression';

export interface CompressOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  initialQuality: number;
}

export async function compressImage(file: File, options: CompressOptions): Promise<File> {
  return await imageCompression(file, options);
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function createObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}
