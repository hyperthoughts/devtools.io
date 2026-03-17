import { Link } from 'react-router';
import { PageTransition } from '../../../components/page-transition.tsx';
import { AppearanceSection } from '../components/appearance-section.tsx';

export function SettingsPage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              customize your devtools.io experience
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            &larr; back
          </Link>
        </div>

        <div className="space-y-8">
          <AppearanceSection />
        </div>
      </div>
    </PageTransition>
  );
}
