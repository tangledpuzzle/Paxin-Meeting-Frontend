'use client';

import ChatNavComponent from '@/components/chat/chat-nav';
import ChatUserInfo from '@/components/chat/chat-user-info';
import { PaxChatContext } from '@/context/chat-context';
import useMediaQuery from '@/hooks/useMediaQuery';
import { cn } from '@/lib/utils';
import React, { useContext, useState, useEffect } from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const isSideOverlap = useMediaQuery('(min-width: 1200px)');
  const { showNav, showSidebar } = useContext(PaxChatContext);
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
    <div
      className={cn(
        'new-container md:side-overlap',
        { open: showNav },
        { 'side-open': isSideOverlap && showSidebar }
      )}
    >
      <ChatNavComponent mode={mode} />
      {children}
      <ChatUserInfo />
    </div>
  );
}
