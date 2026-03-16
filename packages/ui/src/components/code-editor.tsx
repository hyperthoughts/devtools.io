import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn.ts';

export interface CodeEditorProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  language?: string;
}

const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  ({ className, language, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        spellCheck={false}
        data-language={language}
        className={cn(
          'flex min-h-[200px] w-full rounded-md border border-input bg-muted/50 px-3 py-2 font-mono text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
CodeEditor.displayName = 'CodeEditor';

export { CodeEditor };
