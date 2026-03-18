export interface ParseResult {
  valid: boolean;
  protocol?: string;
  host?: string;
  port?: string;
  pathname?: string;
  searchParams?: Array<{ key: string; value: string }>;
  hash?: string;
}

export function parseUrl(input: string): ParseResult {
  try {
    const url = new URL(input);
    const searchParams: Array<{ key: string; value: string }> = [];
    url.searchParams.forEach((value, key) => {
      searchParams.push({ key, value });
    });
    return {
      valid: true,
      protocol: url.protocol,
      host: url.hostname,
      port: url.port,
      pathname: url.pathname,
      searchParams,
      hash: url.hash,
    };
  } catch {
    return { valid: false };
  }
}
