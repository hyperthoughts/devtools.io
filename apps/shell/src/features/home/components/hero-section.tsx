import { motion } from 'framer-motion';
import { Logo } from '../../../components/logo.tsx';
import { SearchBar } from '../../../components/search-bar.tsx';
import { useSearch } from '../../../contexts/search-context.tsx';

export function HeroSection() {
  const { submitSearch } = useSearch();

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center pb-6 pt-24 text-center"
    >
      <Logo size="lg" />

      <div className="mt-10 w-full max-w-xl">
        <SearchBar
          placeholder="search tools ..."
          onSearch={submitSearch}
          showButton
          data-search-input
        />
      </div>
    </motion.section>
  );
}
