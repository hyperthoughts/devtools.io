import type { OpenFileOptions } from './types.ts';

export function pickFileFallback(options?: OpenFileOptions): Promise<File | File[] | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';

    if (options?.accept?.length) {
      input.accept = options.accept.join(',');
    }
    if (options?.multiple) {
      input.multiple = true;
    }

    input.addEventListener('change', () => {
      const files = input.files;
      if (!files || files.length === 0) {
        resolve(null);
        return;
      }
      resolve(options?.multiple ? Array.from(files) : files[0]!);
    });

    input.addEventListener('cancel', () => resolve(null));
    input.click();
  });
}

export function saveFileFallback(blob: Blob, suggestedName?: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = suggestedName ?? 'download';
  a.click();
  URL.revokeObjectURL(url);
}
