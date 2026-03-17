import { NavLink, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from '@devtools/ui';
import { Logo } from './logo.tsx';
import { SearchBar } from './search-bar.tsx';
import { useSearch } from '../contexts/search-context.tsx';
import { ROUTES } from '../constants/routes.ts';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { submitSearch } = useSearch();

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
        <Logo size="sm" />

        {!isHome && (
          <div className="mx-4 flex-1">
            <SearchBar
              placeholder="search tools ..."
              onSearch={submitSearch}
              className="max-w-md"
            />
          </div>
        )}

        {isHome && <div className="flex-1" />}

        <nav className="flex items-center gap-1">
          <NavLink
            to={ROUTES.EXPLORE}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )
            }
          >
            explore
          </NavLink>
          <NavLink
            to={ROUTES.FAVORITES}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )
            }
          >
            favorites
          </NavLink>
          <NavLink
            to={ROUTES.SETTINGS}
            className={({ isActive }) =>
              cn(
                'inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:text-foreground',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )
            }
          >
            settings
          </NavLink>

          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              connect
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                <span className="flex items-center gap-2 text-sm font-medium">
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
                    <polyline points="4 17 10 11 4 5" />
                    <line x1="12" y1="19" x2="20" y2="19" />
                  </svg>
                  Connect to CLI
                </span>
                <span className="text-xs text-muted-foreground">Manage tools & plugins</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-0.5 py-2">
                <span className="flex items-center gap-2 text-sm font-medium">
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
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                    <path d="M2 12h20" />
                  </svg>
                  Connect to Community
                </span>
                <span className="text-xs text-muted-foreground">Social features & identity</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </motion.header>
  );
}
