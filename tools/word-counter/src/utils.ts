export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  lines: number;
  paragraphs: number;
  bytes: number;
  readingTimeMin: number;
}

export function computeStats(text: string): TextStats {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      lines: 0,
      paragraphs: 0,
      bytes: 0,
      readingTimeMin: 0,
    };
  }

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s+/g, '').length;

  // Words: split by whitespace
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  // Lines: split by newline
  const lines = text.split(/\r\n|\r|\n/).length;

  // Paragraphs: split by multiple newlines
  const paragraphs =
    text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim() !== '').length;

  // Bytes: Blob size
  const bytes = new Blob([text]).size;

  // Reading time based on 200 words per minute average
  const readingTimeMin = Math.ceil(words / 200);

  return {
    characters,
    charactersNoSpaces,
    words,
    lines,
    paragraphs,
    bytes,
    readingTimeMin,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
