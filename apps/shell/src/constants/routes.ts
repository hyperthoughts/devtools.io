export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  EXPLORE: '/explore',
  FAVORITES: '/favorites',
  TOOL_DETAIL: '/tools/:toolId',
  SETTINGS: '/settings',
} as const;

export function toolDetailPath(toolId: string): string {
  return `/tools/${toolId}`;
}
