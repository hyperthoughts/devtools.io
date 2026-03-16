export class OPFSService {
  async getToolDirectory(toolId: string): Promise<FileSystemDirectoryHandle> {
    const root = await navigator.storage.getDirectory();
    return root.getDirectoryHandle(toolId, { create: true });
  }

  async writeFile(dir: FileSystemDirectoryHandle, name: string, data: BufferSource): Promise<void> {
    const fileHandle = await dir.getFileHandle(name, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(data);
    await writable.close();
  }

  async readFile(dir: FileSystemDirectoryHandle, name: string): Promise<ArrayBuffer> {
    const fileHandle = await dir.getFileHandle(name);
    const file = await fileHandle.getFile();
    return file.arrayBuffer();
  }

  async deleteFile(dir: FileSystemDirectoryHandle, name: string): Promise<void> {
    await dir.removeEntry(name);
  }

  async listFiles(dir: FileSystemDirectoryHandle): Promise<string[]> {
    const names: string[] = [];
    for await (const entry of dir.values()) {
      if (entry.kind === 'file') {
        names.push(entry.name);
      }
    }
    return names;
  }
}
