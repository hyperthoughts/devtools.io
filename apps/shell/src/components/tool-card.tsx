import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { cn } from '@devtools/ui';
import { toolDetailPath } from '../constants/routes.ts';
import { TagBadge } from './tag-badge.tsx';
import { FavoriteButton } from './favorite-button.tsx';
import type { ToolEntry } from '../types/index.ts';

interface ToolCardProps {
  tool: ToolEntry;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={toolDetailPath(tool.id)}
        className={cn(
          'block rounded-lg border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground">{tool.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <FavoriteButton tool={tool} />
            <span className="text-xs text-muted-foreground">v{tool.version}</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.slice(0, 5).map((tag) => (
            <TagBadge key={tag} tag={tag} linked={false} />
          ))}
          {tool.tags.length > 5 && (
            <span className="text-xs text-muted-foreground">+{tool.tags.length - 5}</span>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
