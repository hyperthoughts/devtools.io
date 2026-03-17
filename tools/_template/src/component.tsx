import type { ToolContext } from '@devtools/core';
import { Card, CardHeader, CardTitle, CardContent } from '@devtools/ui';

export function Component({ ctx }: { ctx: ToolContext }) {
  // Reactive read from IndexedDB -- auto re-renders when value changes
  // const savedValue = ctx.useLive<string>('myKey');

  // Imperative write -- triggers re-render for all useLive subscribers
  // void ctx.storage.set('myKey', 'newValue');

  void ctx;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tool Name</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Start building your tool here.</p>
      </CardContent>
    </Card>
  );
}
