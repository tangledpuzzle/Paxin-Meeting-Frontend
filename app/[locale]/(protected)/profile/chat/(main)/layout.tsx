'use client';

import ChatNavComponent from '@/components/dialogs/chat-nav';
import { PaxChatContext } from '@/context/chat-context';
import { cn } from '@/lib/utils';
import { useContext, useEffect } from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  const { showNav } = useContext(PaxChatContext);

  return (
    <div className={cn('new-container', { open: showNav })}>
      <ChatNavComponent />
      {children}
    </div>
  );
}
