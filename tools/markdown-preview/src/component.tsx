import { useState, useEffect, useRef, useCallback } from 'react';
import type { ToolContext } from '@devtools/core';
import { CopyButton, Button, ScrollArea } from '@devtools/ui';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const DEFAULT_MARKDOWN = `# Welcome to Markdown Preview

This is a real-time markdown editor with **GitHub Flavored Markdown** support.

## Syntax Highlighting

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}
greet('World');
\`\`\`

## Lists and Task Lists

- [x] Write implementation plan
- [x] Scaffold \`markdown-preview\`
- [ ] Add sidebar toggle UI feature
- [ ] Profit?

## Tables

| Feature | Support |
|---------|:-------:|
| GFM | ✅ |
| Syntax Highlighting | ✅ |
| Export | ✅ |
`;

export function Component({ ctx }: { ctx: ToolContext }) {
  const savedInput = ctx.useLive<string>('input');
  const [input, setInput] = useState('');
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (savedInput !== undefined) {
        initialized.current = true;
        setInput(savedInput || DEFAULT_MARKDOWN);
      }
    }
  }, [savedInput]);

  const updateStorage = useCallback(
    (val: string) => {
      void ctx.storage.set('input', val);
    },
    [ctx.storage],
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    updateStorage(val);
  };

  const insertText = (before: string, after = '') => {
    const el = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = input.substring(start, end);
    const newText =
      input.substring(0, start) + before + selectedText + after + input.substring(end);
    setInput(newText);
    updateStorage(newText);

    // Restore cursor position after state updates
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleDownload = async () => {
    if (!ctx.filesystem) return;
    try {
      const blob = new Blob([input], { type: 'text/markdown' });
      await ctx.filesystem.saveFile(blob, 'document.md');
    } catch (err) {
      console.error('Failed to download file', err);
    }
  };

  return (
    <div className="flex h-full min-h-[600px] flex-col overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-center gap-2 border-b p-2">
        <Button variant="ghost" size="sm" onClick={() => insertText('**', '**')} title="Bold">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 12a4 4 0 0 0 0-8H6v8" />
            <path d="M15 20a4 4 0 0 0 0-8H6v8Z" />
          </svg>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertText('*', '*')} title="Italic">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" x2="10" y1="4" y2="4" />
            <line x1="14" x2="5" y1="20" y2="20" />
            <line x1="15" x2="9" y1="4" y2="20" />
          </svg>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertText('## ')} title="Heading">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12h8" />
            <path d="M4 18V6" />
            <path d="M12 18V6" />
            <path d="m17 12 3-2v8" />
          </svg>
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={() => insertText('[', '](url)')} title="Link">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertText('`', '`')} title="Code">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <Button variant="ghost" size="sm" onClick={() => insertText('- ')} title="List">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="8" x2="21" y1="6" y2="6" />
            <line x1="8" x2="21" y1="12" y2="12" />
            <line x1="8" x2="21" y1="18" y2="18" />
            <line x1="3" x2="3.01" y1="6" y2="6" />
            <line x1="3" x2="3.01" y1="12" y2="12" />
            <line x1="3" x2="3.01" y1="18" y2="18" />
          </svg>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => insertText('- [ ] ')} title="Task List">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 11 3 3L22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
        </Button>

        <div className="ml-auto flex items-center gap-2">
          {input && <CopyButton value={input} />}
          {ctx.filesystem && (
            <Button variant="secondary" size="sm" onClick={handleDownload} title="Download .md">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1.5"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" x2="12" y1="15" y2="3" />
              </svg>
              Download
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x">
        <div className="flex-1 p-0 relative">
          <textarea
            id="markdown-editor"
            value={input}
            onChange={handleChange}
            placeholder="Type markdown here..."
            spellCheck={false}
            className="absolute inset-0 resize-none bg-muted/20 p-4 font-mono text-sm leading-relaxed focus:outline-none w-full h-full"
          />
        </div>
        <div className="flex-1 bg-background relative">
          <ScrollArea className="absolute inset-0 p-6">
            <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
              <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                {input}
              </Markdown>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
