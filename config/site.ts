export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: "Paxintrade",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Blogs",
      href: "/blogs",
    },
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Contact Us",
      href: "/contact",
    },
  ],
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
    docs: "https://ui.shadcn.com",
  },
  footer: {
    about: [
      {
        title: "About Us",
        href: "/about",
      },
      {
        title: "Contact Us",
        href: "/contact",
      },
      {
        title: "Privacy Policy",
        href: "/privacy",
      },
      {
        title: "Terms & Conditions",
        href: "/terms",
      },
      {
        title: "FAQ",
        href: "/faq",
      }
    ],
    product: [
      {
        title: "Documentation",
        href: "/docs",
      },
      {
        title: "Blog",
        href: "/blog",
      },
      {
        title: "Changelog",
        href: "/changelog",
      }
    ],
    resources: [
      {
        title: "Community",
        href: "/community",
      },
      {
        title: "Discord",
        href: "https://discord.gg/shadcn",
      },
      {
        title: "Twitter",
        href: "https://twitter.com/shadcn",
      }
    ],
    social: {
      facebook: "https://facebook.com/shadcn",
      instagram: "https://instagram.com/shadcn",
      twitter: "https://twitter.com/shadcn",
      github: "https://github.com/shadcn/ui",
    }
  }
}
