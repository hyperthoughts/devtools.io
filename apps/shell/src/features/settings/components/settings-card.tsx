import { Switch } from '@devtools/ui';
import type { ReactNode } from 'react';

interface SettingsCardProps {
  label: string;
  description?: string;
  children?: ReactNode;
}

export function SettingsCard({ label, description, children }: SettingsCardProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

interface SettingsToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function SettingsToggle({
  label,
  description,
  checked,
  onCheckedChange,
}: SettingsToggleProps) {
  return (
    <SettingsCard label={label} description={description}>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </SettingsCard>
  );
}
