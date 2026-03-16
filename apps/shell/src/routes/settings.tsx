import { useTheme } from '../providers/theme-provider.tsx';
import { Button } from '@devtools/ui';

export function Settings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      <div className="mt-6 space-y-6">
        <div>
          <h2 className="text-sm font-medium">Theme</h2>
          <div className="mt-2 flex gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <Button
                key={t}
                variant={theme === t ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTheme(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
