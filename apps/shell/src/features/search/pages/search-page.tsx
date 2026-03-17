import { PageTransition } from '../../../components/page-transition.tsx';
import { SearchHeader } from '../components/search-header.tsx';
import { SearchResults } from '../components/search-results.tsx';
import { useSearchTools } from '../hooks/use-search.ts';

export function SearchPage() {
  const { results, sort, setSort, view, setView, totalCount } = useSearchTools();

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold tracking-tight">search</h1>

        <div className="space-y-6">
          <SearchHeader
            totalCount={totalCount}
            sort={sort}
            onSortChange={setSort}
            view={view}
            onViewChange={setView}
          />
          <SearchResults results={results} view={view} />
        </div>
      </div>
    </PageTransition>
  );
}
