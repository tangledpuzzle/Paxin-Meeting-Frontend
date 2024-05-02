export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Paxintrade',
  description:
    'Beautifully designed components built with Radix UI and Tailwind CSS.',
  mainNav: [
    {
      title: 'home',
      href: '/home',
    },
    {
      title: 'about',
      href: '/about',
    },
    {
      title: 'contact',
      href: '/contact',
    },
    {
      title: 'trade',
      href: '/stream',
    },
  ],
  links: {
    twitter: 'https://twitter.com/shadcn',
    github: 'https://github.com/shadcn/ui',
    docs: 'https://ui.shadcn.com',
  },
  footer: {
    about: [
      {
        title: 'about',
        href: '/about',
      },
      {
        title: 'contact',
        href: '/contact',
      },
      {
        title: 'privacy_policy',
        href: '/privacy',
      },
      {
        title: 'terms_and_conditions',
        href: '/terms',
      },
      {
        title: 'faq',
        href: '/faq',
      },
    ],
    product: [
      {
        title: 'documentation',
        href: '/docs',
      },
      {
        title: 'blog',
        href: '/blog',
      },
      {
        title: 'changelog',
        href: '/changelog',
      },
    ],
    resources: [
      {
        title: 'community',
        href: '/community',
      },
      {
        title: 'discord',
        href: 'https://discord.gg/shadcn',
      },
      {
        title: 'twitter',
        href: 'https://twitter.com/paxintrade',
      },
    ],
    social: {
      facebook: 'https://www.facebook.com/paxintrade',
      instagram: 'https://instagram.com/shadcn',
      twitter: 'https://twitter.com/paxintrade',
      github: 'https://github.com/shadcn/ui',
    },
  },
};
