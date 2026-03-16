import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { cn } from '@devtools/ui';
import { TagBadge } from '../../../components/tag-badge.tsx';
import { toolDetailPath } from '../../../constants/routes.ts';
import type { ToolEntry } from '../../../types/index.ts';

interface SearchResultCardProps {
  tool: ToolEntry;
  index: number;
  view: 'list' | 'grid';
}

export function SearchResultCard({ tool, index, view }: SearchResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
    >
      <Link
        to={toolDetailPath(tool.id)}
        className={cn(
          'block rounded-lg border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md',
          view === 'grid' && 'h-full',
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground">{tool.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">v{tool.version}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tool.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} linked={false} />
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
