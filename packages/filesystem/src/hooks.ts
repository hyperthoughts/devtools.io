import { useMemo } from 'react';
import { FileSystemService } from './fs-service.ts';
import type { OpenFileOptions } from './types.ts';

export function useFileSystem(): FileSystemService {
  return useMemo(() => new FileSystemService(), []);
}

export function useFilePicker(options?: OpenFileOptions) {
  const fs = useFileSystem();

  return {
    pick: () => fs.openFile(options),
    isNativeSupported: fs.isNativeSupported,
  };
}

export function useDirectoryPicker() {
  const fs = useFileSystem();

  return {
    pick: () => fs.openDirectory(),
    isNativeSupported: fs.isNativeSupported,
  };
}
