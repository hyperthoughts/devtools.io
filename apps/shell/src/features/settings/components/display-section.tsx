import { SettingsToggle } from './settings-card.tsx';
import { useSettings } from '../../../contexts/settings-context.tsx';
import { useSearch } from '../../../contexts/search-context.tsx';

export function DisplaySection() {
  const { relativeDates, setRelativeDates } = useSettings();
  const { instantSearchEnabled, toggleInstantSearch } = useSearch();

  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Display
      </h2>
      <div className="divide-y rounded-lg border px-5">
        <SettingsToggle
          label="Relative dates"
          checked={relativeDates}
          onCheckedChange={setRelativeDates}
        />
        <SettingsToggle
          label="Instant search"
          description="Show results as you type in the search bar"
          checked={instantSearchEnabled}
          onCheckedChange={toggleInstantSearch}
        />
      </div>
    </section>
  );
}
