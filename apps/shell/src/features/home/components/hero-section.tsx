import { motion } from 'framer-motion';
import { Logo } from '../../../components/logo.tsx';
import { SearchBar } from '../../../components/search-bar.tsx';
import { useSearch } from '../../../contexts/search-context.tsx';
import { siteConfig } from '../../../config/site.ts';

export function HeroSection() {
  const { instantSearchEnabled, toggleInstantSearch, submitSearch } = useSearch();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center pb-6 pt-24 text-center"
    >
      <Logo size="lg" />
      <p className="mt-3 text-sm text-muted-foreground">{siteConfig.tagline}</p>

      <div className="mt-10 w-full max-w-xl">
        <SearchBar
          placeholder="search tools ..."
          onSearch={submitSearch}
          showButton
          data-search-input
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-3 flex items-center gap-1 text-xs text-muted-foreground"
      >
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
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
        </svg>
        instant search {instantSearchEnabled ? 'on' : 'off'} &mdash;{' '}
        <button
          type="button"
          onClick={toggleInstantSearch}
          className="underline hover:text-foreground"
        >
          turn {instantSearchEnabled ? 'off' : 'on'}
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-2 text-xs text-muted-foreground"
      >
        built {siteConfig.builtDate} &middot;{' '}
        <a href={siteConfig.links.github} className="text-primary hover:underline">
          v{siteConfig.version}
        </a>{' '}
        <svg
          className="mb-0.5 inline-block"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h6v6" />
          <path d="M10 14 21 3" />
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        </svg>
      </motion.p>
    </motion.section>
  );
}
