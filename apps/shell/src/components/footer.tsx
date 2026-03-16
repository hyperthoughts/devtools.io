import { siteConfig } from '../config/site.ts';

export function Footer() {
  return (
    <footer className="border-t py-8 text-center text-xs text-muted-foreground">
      <p className="mb-3 text-sm">{siteConfig.tagline}</p>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-4">
        <a href="#" className="hover:text-foreground">
          about
        </a>
        <a href="#" className="hover:text-foreground">
          blog
        </a>
        <a href="#" className="hover:text-foreground">
          privacy policy
        </a>
        <a href="#" className="hover:text-foreground">
          a11y
        </a>
        <a href="#" className="hover:text-foreground">
          keyboard shortcuts
        </a>
      </div>
      <div className="mb-3 flex flex-wrap items-center justify-center gap-4">
        <a href="#" className="hover:text-foreground">
          docs
        </a>
        <a href={siteConfig.links.github} className="hover:text-foreground">
          source
        </a>
        <a href="#" className="hover:text-foreground">
          social
        </a>
        <a href={siteConfig.links.discord} className="hover:text-foreground">
          chat
        </a>
      </div>
    </footer>
  );
}
