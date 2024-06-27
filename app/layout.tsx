"use client"

import type { ReactNode } from "react";
import { useEffect } from "react";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Страница стала видимой, перезагрузка');
        window.location.reload();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
}
