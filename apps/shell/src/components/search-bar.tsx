import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@devtools/ui';

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void;
  showButton?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, onSearch, showButton = false, onKeyDown, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(e.currentTarget.value);
      }
      onKeyDown?.(e);
    };

    return (
      <div className={cn('relative flex items-center', className)}>
        <span className="pointer-events-none absolute left-3 text-sm text-muted-foreground">/</span>
        <input
          ref={ref}
          type="text"
          className="h-10 w-full rounded-md border border-input bg-transparent pl-7 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-ring"
          onKeyDown={handleKeyDown}
          {...props}
        />
        {showButton && (
          <button
            type="button"
            className="ml-2 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            onClick={() => {
              const input = document.querySelector<HTMLInputElement>('[data-search-input]');
              if (input && onSearch) onSearch(input.value);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            search
          </button>
        )}
      </div>
    );
  },
);
SearchBar.displayName = 'SearchBar';

export { SearchBar };
