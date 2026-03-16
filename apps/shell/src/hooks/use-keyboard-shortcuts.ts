import { useEffect } from 'react';

interface ShortcutOptions {
  onSlash?: () => void;
  onEscape?: () => void;
}

export function useKeyboardShortcuts({ onSlash, onEscape }: ShortcutOptions) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      if (e.key === '/' && !isInput && onSlash) {
        e.preventDefault();
        onSlash();
      }
      if (e.key === 'Escape' && onEscape) {
        onEscape();
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onSlash, onEscape]);
}
