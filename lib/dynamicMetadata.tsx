'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

export function MetadataUpdater() {
  const { theme } = useTheme();

  const updateFavicon = (theme: string) => {
    const faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (!faviconLink) return;

    if (theme === 'light') {
      faviconLink.href = '/favicon-dark.ico';
    } else {
      faviconLink.href = '/favicon-light.ico';
    }
  };

  const updateManifest = (theme: string) => {
    const manifestLink = document.querySelector("link[rel~='manifest']") as HTMLLinkElement;
    if (!manifestLink) return;

    if (theme === 'dark') {
      manifestLink.href = '/manifest-dark.webmanifest';
    } else {
      manifestLink.href = '/manifest-light.webmanifest';
    }
  };

  useEffect(() => {
    updateFavicon(theme ?? 'light');
    updateManifest(theme ?? 'light');
  }, [theme]);

  return <div />;
}
