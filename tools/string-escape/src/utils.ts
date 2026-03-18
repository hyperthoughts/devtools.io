export function escapeString(text: string): string {
  if (!text) return '';
  return JSON.stringify(text).slice(1, -1);
}

export function unescapeString(text: string): string {
  if (!text) return '';
  try {
    // We parse it as a JSON string to properly unescape \n, \t, etc.
    const parsed = JSON.parse(`"${text.replace(/"/g, '\\"')}"`);
    return parsed;
  } catch {
    // Fallback simple unescape if JSON parse fails
    return text
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\b/g, '\b')
      .replace(/\\f/g, '\f')
      .replace(/\\v/g, '\v')
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
}
