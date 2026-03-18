import cronstrue from 'cronstrue';

export function parseCron(expression: string): { description: string; error: string | null } {
  try {
    if (!expression.trim()) return { description: '', error: null };
    const desc = cronstrue.toString(expression, { throwExceptionOnParseError: true });
    return { description: desc, error: null };
  } catch (err: any) {
    return { description: '', error: err.message || 'Invalid cron expression' };
  }
}
