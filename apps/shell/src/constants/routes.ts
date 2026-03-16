export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  TOOL_DETAIL: '/tools/:toolId',
  SETTINGS: '/settings',
  COMPARE: '/compare',
} as const;

export function toolDetailPath(toolId: string): string {
  return `/tools/${toolId}`;
}
