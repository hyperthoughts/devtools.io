import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router';
import type { ToolDefinition, ToolContext } from '@devtools/core';
import { useScopedLive } from '@devtools/storage';
import { useStorageContext } from '../../../contexts/storage-context.tsx';
import { useWorkerContext } from '../../../contexts/worker-context.tsx';
import { useFilesystemContext } from '../../../contexts/filesystem-context.tsx';
import { useTheme } from '../../../contexts/theme-context.tsx';
import { loadTool } from '../../../registry/tool-loader.ts';
import { PageTransition } from '../../../components/page-transition.tsx';
import { ToolOverview } from '../components/tool-overview.tsx';
import { ToolSidebar } from '../components/tool-sidebar.tsx';
import { ToolContent } from '../components/tool-content.tsx';

function ToolSkeleton() {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function ToolError({ toolId, error }: { toolId: string; error: string }) {
  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-destructive">Failed to load tool</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Could not load &quot;{toolId}&quot;: {error}
        </p>
      </div>
    </div>
  );
}

export function ToolDetailPage() {
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
      toolId,
      storage,
      useLive: <T,>(key: string) => useScopedLive<T>(toolId, key),
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
    <PageTransition>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            <ToolOverview tool={tool} />
            <ToolContent tool={tool} ctx={ctx} />
          </div>
          <ToolSidebar tool={tool} />
        </div>
      </div>
    </PageTransition>
  );
}
