import { motion } from 'framer-motion';
import { TagBadge } from '../../../components/tag-badge.tsx';

const POPULAR_TAGS = [
  'formatters',
  'encoders',
  'generators',
  'converters',
  'validators',
  'crypto',
  'text',
  'json',
  'base64',
  'hash',
] as const;

export function PopularTags() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-2 py-8"
    >
      {POPULAR_TAGS.map((tag) => (
        <TagBadge key={tag} tag={tag} />
      ))}
    </motion.section>
  );
}
