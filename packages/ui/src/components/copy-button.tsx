import { useState, useCallback } from 'react';
import { Button, type ButtonProps } from './button.tsx';

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick'> {
  value: string;
  onCopy?: () => void;
}

export function CopyButton({ value, onCopy, children, ...props }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    onCopy?.();
    setTimeout(() => setCopied(false), 2000);
  }, [value, onCopy]);

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} {...props}>
      {copied ? 'Copied!' : (children ?? 'Copy')}
    </Button>
  );
}
