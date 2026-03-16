export interface FormatResult {
  output: string;
  error: string | null;
  isValid: boolean;
}

export function formatJson(input: string, indent: number = 2): FormatResult {
  if (!input.trim()) {
    return { output: '', error: null, isValid: true };
  }
  try {
    const parsed = JSON.parse(input);
    return {
      output: JSON.stringify(parsed, null, indent),
      error: null,
      isValid: true,
    };
  } catch (e) {
    return {
      output: input,
      error: e instanceof Error ? e.message : 'Invalid JSON',
      isValid: false,
    };
  }
}

export function minifyJson(input: string): FormatResult {
  if (!input.trim()) {
    return { output: '', error: null, isValid: true };
  }
  try {
    const parsed = JSON.parse(input);
    return {
      output: JSON.stringify(parsed),
      error: null,
      isValid: true,
    };
  } catch (e) {
    return {
      output: input,
      error: e instanceof Error ? e.message : 'Invalid JSON',
      isValid: false,
    };
  }
}

export function validateJson(input: string): { isValid: boolean; error: string | null } {
  if (!input.trim()) {
    return { isValid: true, error: null };
  }
  try {
    JSON.parse(input);
    return { isValid: true, error: null };
  } catch (e) {
    return {
      isValid: false,
      error: e instanceof Error ? e.message : 'Invalid JSON',
    };
  }
}
