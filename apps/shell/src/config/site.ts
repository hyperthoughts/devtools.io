export const siteConfig = {
  name: 'devtools.io',
  tagline: 'a fast, private-first toolkit for developers',
  version: '0.1.0',
  stage: 'alpha',
  builtDate: new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
  links: {
    github: 'https://github.com/devtools-io/devtools.io',
    discord: '#',
    bluesky: '#',
  },
} as const;
