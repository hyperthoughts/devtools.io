export interface OpenFileOptions {
  accept?: string[];
  multiple?: boolean;
}

/** Minimal type for File System Access API showOpenFilePicker */
export interface OpenFilePickerOptions {
  multiple?: boolean;
  types?: Array<{ description: string; accept: Record<string, string[]> }>;
}

/** Minimal type for File System Access API showSaveFilePicker */
export interface SaveFilePickerOptions {
  suggestedName?: string;
}

export interface SaveFileOptions {
  suggestedName?: string;
  types?: Array<{
    description: string;
    accept: Record<string, string[]>;
  }>;
}
