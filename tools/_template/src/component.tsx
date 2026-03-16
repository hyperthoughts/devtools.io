import type { ToolContext } from '@devtools/core';
import { Card, CardHeader, CardTitle, CardContent } from '@devtools/ui';

export function Component({ ctx }: { ctx: ToolContext }) {
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
