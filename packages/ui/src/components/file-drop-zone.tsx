import { useState, useCallback, type DragEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn.ts';

export interface FileDropZoneProps {
  onDrop: (files: File[]) => void;
  accept?: string[];
  multiple?: boolean;
  children?: ReactNode;
  className?: string;
}

export function FileDropZone({
  onDrop,
  accept,
  multiple = false,
  children,
  className,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const dt = e.dataTransfer;
      if (!dt?.files.length) return;

      let files = Array.from(dt.files);

      if (accept?.length) {
        files = files.filter((f) =>
          accept.some((a) => f.type === a || f.name.endsWith(a.replace('*', ''))),
        );
      }

      if (!multiple) {
        files = files.slice(0, 1);
      }

      if (files.length > 0) {
        onDrop(files);
      }
    },
    [onDrop, accept, multiple],
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex min-h-[120px] items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        className,
      )}
    >
      {children ?? (
        <p className="text-sm text-muted-foreground">Drop files here or click to browse</p>
      )}
    </div>
  );
}
