export type ImageFormat = 'image/png' | 'image/jpeg' | 'image/webp' | 'image/bmp';

export async function convertImage(
  file: File | Blob,
  targetFormat: ImageFormat,
  quality: number,
): Promise<Blob> {
  const imgBitmap = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(imgBitmap.width, imgBitmap.height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to get canvas context');

  if (targetFormat === 'image/jpeg' || targetFormat === 'image/bmp') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(imgBitmap, 0, 0);

  return await canvas.convertToBlob({
    type: targetFormat,
    quality: quality,
  });
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
