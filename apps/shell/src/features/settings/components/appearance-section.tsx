import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, cn } from '@devtools/ui';
import {
  useTheme,
  type AccentColor,
  type BackgroundShade,
  type Theme,
} from '../../../contexts/theme-context.tsx';

const ACCENT_COLORS: { value: AccentColor; color: string }[] = [
  { value: 'blue', color: 'bg-blue-500' },
  { value: 'pink', color: 'bg-pink-500' },
  { value: 'orange', color: 'bg-orange-500' },
  { value: 'yellow', color: 'bg-yellow-500' },
  { value: 'green', color: 'bg-green-500' },
  { value: 'indigo', color: 'bg-indigo-500' },
  { value: 'purple', color: 'bg-purple-500' },
];

const BACKGROUND_SHADES: { value: BackgroundShade; color: string }[] = [
  { value: 'default', color: 'bg-zinc-950' },
  { value: 'zinc', color: 'bg-zinc-900' },
  { value: 'slate', color: 'bg-slate-900' },
  { value: 'stone', color: 'bg-stone-900' },
  { value: 'gray', color: 'bg-gray-900' },
  { value: 'neutral', color: 'bg-neutral-900' },
];

export function AppearanceSection() {
  const { theme, setTheme, accentColor, setAccentColor, backgroundShade, setBackgroundShade } =
    useTheme();

  return (
    <section>
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Appearance
      </h2>
      <div className="space-y-6 rounded-lg border p-5">
        <div>
          <label className="mb-2 block text-sm font-medium">Theme</label>
          <Select value={theme} onValueChange={(v) => setTheme(v as Theme)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Accent colors</label>
          <div className="flex gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setAccentColor(c.value)}
                className={cn(
                  'h-7 w-7 rounded-full transition-all',
                  c.color,
                  accentColor === c.value
                    ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                    : 'hover:scale-110',
                )}
                aria-label={c.value}
              />
            ))}
            <button
              type="button"
              onClick={() => setAccentColor('none')}
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full border transition-all',
                accentColor === 'none'
                  ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                  : 'hover:scale-110',
              )}
              aria-label="No accent"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m4.9 4.9 14.2 14.2" />
              </svg>
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Background shade</label>
          <div className="flex gap-2">
            {BACKGROUND_SHADES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setBackgroundShade(s.value)}
                className={cn(
                  'h-7 w-7 rounded-full border transition-all',
                  s.color,
                  backgroundShade === s.value
                    ? 'ring-2 ring-ring ring-offset-2 ring-offset-background'
                    : 'hover:scale-110',
                )}
                aria-label={s.value}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
