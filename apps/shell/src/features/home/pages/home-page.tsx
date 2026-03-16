import { PageTransition } from '../../../components/page-transition.tsx';
import { HeroSection } from '../components/hero-section.tsx';
import { PopularTags } from '../components/popular-tags.tsx';
import { GetInvolved } from '../components/get-involved.tsx';

export function HomePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4">
        <HeroSection />
        <PopularTags />
        <GetInvolved />
      </div>
    </PageTransition>
  );
}
