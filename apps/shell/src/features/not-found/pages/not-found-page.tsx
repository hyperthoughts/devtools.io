import { Link } from 'react-router';
import { PageTransition } from '../../../components/page-transition.tsx';

export function NotFoundPage() {
  return (
    <PageTransition>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold tracking-tight text-muted-foreground">404</h1>
        <p className="mt-4 text-lg text-muted-foreground">Page not found</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          &larr; back to home
        </Link>
      </div>
    </PageTransition>
  );
}
