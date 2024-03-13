'use client';

import ChatNavComponent from '@/components/dialogs/chat-nav';
import { PaxChatContext } from '@/context/chat-context';
import { cn } from '@/lib/utils';
import { useContext, useState, useEffect } from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { showNav } = useContext(PaxChatContext);
  const [mode, setMode] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeQueryParam = params.get('mode');
    if (modeQueryParam === 'false') {
      if (window.innerWidth < 768) {
        setMode(false);
      } else {
        setMode(true);
      }
    }
  }, []);

  return (
    <div className={cn('new-container', { open: showNav })}>
      <ChatNavComponent mode={mode} />
      {children}
    </div>
  );
}
