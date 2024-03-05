import ChatNavComponent from '@/components/dialogs/chat-nav';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <>
      <ChatNavComponent />
      {children}
    </>
  );
}
