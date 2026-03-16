import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@devtools/ui';
import { useSearch } from '../contexts/search-context.tsx';
import { useDebounce } from '../hooks/use-debounce.ts';
import { useKeyboardShortcuts } from '../hooks/use-keyboard-shortcuts.ts';
import { filterTools } from '../utils/search.ts';
import { toolDetailPath } from '../constants/routes.ts';
import type { ToolEntry } from '../types/index.ts';

interface InstantSearchProps {
  tools: ToolEntry[];
}

export function InstantSearch({ tools }: InstantSearchProps) {
  const [open, setOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { instantSearchEnabled } = useSearch();
  const debouncedQuery = useDebounce(localQuery, 150);

  const filtered = instantSearchEnabled ? filterTools(tools, debouncedQuery) : [];

  const openSearch = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, []);

  const closeSearch = useCallback(() => {
    setOpen(false);
    setLocalQuery('');
  }, []);

  useKeyboardShortcuts({
    onSlash: openSearch,
    onEscape: closeSearch,
  });

  const selectTool = useCallback(
    (toolId: string) => {
      void navigate(toolDetailPath(toolId));
      closeSearch();
    },
    [navigate, closeSearch],
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[18vh]"
        >
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={closeSearch}
            role="presentation"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-lg rounded-xl border bg-popover shadow-2xl"
          >
            <div className="flex items-center border-b px-4">
              <span className="text-sm text-muted-foreground">/</span>
              <input
                ref={inputRef}
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="search tools ..."
                className="flex-1 bg-transparent py-3 pl-2 text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              {localQuery && (
                <button
                  type="button"
                  onClick={() => setLocalQuery('')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                </button>
              )}
            </div>
            <ul className="max-h-[300px] overflow-y-auto p-2">
              {filtered.map((tool, i) => (
                <motion.li
                  key={tool.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <button
                    type="button"
                    onClick={() => selectTool(tool.id)}
                    className={cn(
                      'flex w-full flex-col rounded-md px-3 py-2 text-left transition-colors hover:bg-accent',
                    )}
                  >
                    <span className="text-sm font-medium">{tool.name}</span>
                    <span className="text-xs text-muted-foreground">{tool.description}</span>
                  </button>
                </motion.li>
              ))}
              {debouncedQuery && filtered.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No tools found
                </li>
              )}
              {!debouncedQuery && (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Type to search tools...
                </li>
              )}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
