import type { ReactNode } from 'react';
import { cn } from '../utils/cn.ts';

export interface ToolPanelProps {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ToolPanel({ title, children, actions, className }: ToolPanelProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      {(title || actions) && (
        <div className="mb-3 flex items-center justify-between">
          {title && <h3 className="text-sm font-semibold">{title}</h3>}
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

export interface ToolInputOutputProps {
  input: ReactNode;
  output: ReactNode;
  className?: string;
}

export function ToolInputOutput({ input, output, className }: ToolInputOutputProps) {
  return (
    <div className={cn('grid gap-4 lg:grid-cols-2', className)}>
      {input}
      {output}
    </div>
  );
}

export interface ToolFieldProps {
  label: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export function ToolField({ label, children, actions, className }: ToolFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        {actions}
      </div>
      {children}
    </div>
  );
}
