import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import type { ToolDefinition, ToolContext } from '@devtools/core';
import { useStorageContext } from '../providers/storage-provider.tsx';
import { useWorkerContext } from '../providers/worker-provider.tsx';
import { useFilesystemContext } from '../providers/filesystem-provider.tsx';
import { useTheme } from '../providers/theme-provider.tsx';
import { loadTool } from '../registry/tool-loader.ts';

function ToolSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function ToolError({ toolId, error }: { toolId: string; error: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-destructive">Failed to load tool</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Could not load &quot;{toolId}&quot;: {error}
        </p>
      </div>
    </div>
  );
}

export function ToolRoute() {
  const { toolId } = useParams<{ toolId: string }>();
  const [tool, setTool] = useState<ToolDefinition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { createScopedTable } = useStorageContext();
  const { createPool } = useWorkerContext();
  const { filesystem } = useFilesystemContext();
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!toolId) return;
    setTool(null);
    setError(null);

    loadTool(toolId)
      .then(setTool)
      .catch((err: Error) => setError(err.message));
  }, [toolId]);

  const ctx = useMemo<ToolContext | null>(() => {
    if (!tool || !toolId) return null;

    const storage = createScopedTable(toolId);

    const worker =
      tool.capabilities.needsWorker && tool.capabilities.workerEntry
        ? createPool(
            () =>
              new Worker(new URL(tool.capabilities.workerEntry!, import.meta.url), {
                type: 'module',
              }),
          )
        : null;

    const fs = tool.capabilities.needsFileSystem ? filesystem : null;

    return {
      storage,
      worker,
      filesystem: fs,
      theme: resolvedTheme,
    };
  }, [tool, toolId, resolvedTheme, createScopedTable, createPool, filesystem]);

  useEffect(() => {
    if (!tool || !ctx) return;
    void tool.onMount?.(ctx);
    return () => {
      void tool.onUnmount?.(ctx);
    };
  }, [tool, ctx]);

  if (error) return <ToolError toolId={toolId!} error={error} />;
  if (!tool || !ctx) return <ToolSkeleton />;

  return (
    <div className="h-full p-6" role="main">
      <tool.Component ctx={ctx} />
    </div>
  );
}
