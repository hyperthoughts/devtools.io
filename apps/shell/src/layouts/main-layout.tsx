import { Outlet } from 'react-router';
import { Header } from '../components/header.tsx';
import { InstantSearch } from '../components/instant-search.tsx';

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <InstantSearch />
    </div>
  );
}
