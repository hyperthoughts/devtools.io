import { useState, useEffect, useRef } from 'react';
import type { ToolContext } from '@devtools/core';
import { ToolField, CodeEditor, CopyButton, Badge } from '@devtools/ui';
import { parseJwt, formatTimestamp, type DecodedJWT } from './utils.ts';

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');

  const [input, setInput] = useState('');
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined) {
        initialized.current = true;
        setInput(savedInput || '');
      }
    }
  }, [savedInput]);

  const saveInput = (value: string) => {
    setInput(value);
    void ctx.storage.set('input', value);
  };

  const decoded: DecodedJWT = parseJwt(input);
  const headerStr = decoded.header ? JSON.stringify(decoded.header, null, 2) : '';
  const payloadStr = decoded.payload ? JSON.stringify(decoded.payload, null, 2) : '';

  const iatInfo = decoded.payload?.iat ? formatTimestamp(decoded.payload.iat) : null;
  const expInfo = decoded.payload?.exp ? formatTimestamp(decoded.payload.exp) : null;

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <ToolField label="JWT Token String">
          <CodeEditor
            value={input}
            onChange={(e) => saveInput(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
            className="min-h-[150px] font-mono break-all"
          />
        </ToolField>
      </div>

      {!input.trim() ? (
        <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Enter a JSON Web Token above to decode and analyze it.
        </div>
      ) : !decoded.valid ? (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive font-mono">
          {decoded.error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Header */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-[hsl(var(--destructive))]">
              HEADER: ALGORITHM & TOKEN TYPE
            </h3>
            <ToolField label="Header JSON" actions={<CopyButton value={headerStr} />}>
              <CodeEditor value={headerStr} readOnly language="json" className="min-h-[200px]" />
            </ToolField>
          </div>

          {/* Payload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-[hsl(var(--primary))]">PAYLOAD: DATA</h3>
              {expInfo && (
                <Badge variant={expInfo.isExpired ? 'destructive' : 'default'}>
                  {expInfo.isExpired ? 'Expired' : 'Valid'}
                </Badge>
              )}
            </div>

            <ToolField label="Payload JSON" actions={<CopyButton value={payloadStr} />}>
              <CodeEditor value={payloadStr} readOnly language="json" className="min-h-[200px]" />
            </ToolField>

            <div className="flex flex-col gap-2 rounded-lg border bg-muted/30 p-3 text-sm">
              <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wider mb-1">
                Extracted Claims
              </div>
              {iatInfo && (
                <div className="flex justify-between items-center group">
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">iat</span>
                  <span className="text-muted-foreground flex items-center gap-2">
                    {iatInfo.absolute}
                    <Badge variant="secondary" className="font-normal">
                      {iatInfo.relative}
                    </Badge>
                  </span>
                </div>
              )}
              {expInfo && (
                <div className="flex justify-between items-center group mt-1">
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-xs">exp</span>
                  <span className="text-muted-foreground flex items-center gap-2">
                    {expInfo.absolute}
                    <Badge
                      variant={expInfo.isExpired ? 'destructive' : 'secondary'}
                      className="font-normal"
                    >
                      {expInfo.relative}
                    </Badge>
                  </span>
                </div>
              )}
              {!iatInfo && !expInfo && (
                <div className="text-muted-foreground italic">No timestamp claims found</div>
              )}
            </div>
          </div>

          {/* Signature */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-base font-semibold text-[hsl(var(--ring))]">VERIFY SIGNATURE</h3>
            <div className="rounded-lg border bg-card p-4 font-mono text-sm break-all text-muted-foreground flex items-center justify-between gap-4">
              <span>{decoded.signature}</span>
              <CopyButton value={decoded.signature || ''} />
            </div>
            <p className="text-xs text-muted-foreground px-1">
              Note: This tool only decodes the token. It does not verify the signature. Verification
              requires the secret key or public key.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
