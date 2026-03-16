import type { ToolFileSystem } from '@devtools/core';
import type { OpenFileOptions, OpenFilePickerOptions, SaveFilePickerOptions } from './types.ts';
import { pickFileFallback, saveFileFallback } from './fallback.ts';

export class FileSystemService implements ToolFileSystem {
  readonly isNativeSupported: boolean =
    typeof globalThis !== 'undefined' && 'showOpenFilePicker' in globalThis;

  async openFile(options?: OpenFileOptions): Promise<File | File[] | null> {
    if (this.isNativeSupported) {
      try {
        const pickerOptions: OpenFilePickerOptions = {
          multiple: options?.multiple ?? false,
        };
        if (options?.accept?.length) {
          pickerOptions.types = [
            {
              description: 'Files',
              accept: { '*/*': options.accept },
            },
          ];
        }

        const handles = await (
          globalThis as unknown as {
            showOpenFilePicker: (opts?: OpenFilePickerOptions) => Promise<FileSystemFileHandle[]>;
          }
        ).showOpenFilePicker(pickerOptions);
        const files = await Promise.all(handles.map((h) => h.getFile()));
        return options?.multiple ? files : (files[0] ?? null);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return null;
        }
        throw err;
      }
    }

    return pickFileFallback(options);
  }

  async saveFile(blob: Blob, suggestedName?: string): Promise<void> {
    if (this.isNativeSupported) {
      try {
        const handle = await (
          globalThis as unknown as {
            showSaveFilePicker: (opts?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
          }
        ).showSaveFilePicker({
          suggestedName: suggestedName ?? 'download',
        });
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        throw err;
      }
    }

    saveFileFallback(blob, suggestedName);
  }

  async openDirectory(): Promise<FileSystemDirectoryHandle | null> {
    if (!this.isNativeSupported) {
      return null;
    }

    try {
      return await (
        globalThis as unknown as { showDirectoryPicker: () => Promise<FileSystemDirectoryHandle> }
      ).showDirectoryPicker();
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return null;
      }
      throw err;
    }
  }
}
