import { Outlet } from 'react-router';
import { Header } from '../components/header.tsx';
import { Footer } from '../components/footer.tsx';
import { InstantSearch } from '../components/instant-search.tsx';
import type { ToolEntry } from '../types/index.ts';

interface MainLayoutProps {
  tools: ToolEntry[];
}

export function MainLayout({ tools }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <InstantSearch tools={tools} />
    </div>
  );
}
