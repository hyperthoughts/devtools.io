import { PageTransition } from '../../../components/page-transition.tsx';

export function ComparePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold tracking-tight">compare</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Compare tools side by side. Select tools to get started.
        </p>
        <div className="mt-12 flex items-center justify-center rounded-lg border border-dashed py-24">
          <p className="text-sm text-muted-foreground">Coming soon</p>
        </div>
      </div>
    </PageTransition>
  );
}
