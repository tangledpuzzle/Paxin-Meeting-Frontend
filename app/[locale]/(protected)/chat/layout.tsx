import ChatProviders from '@/provider/chat-provider';
import React from 'react'
interface ChatProvidersLayoutProps {
  children: React.ReactNode;
}

export default function ChatProvidersLayout({
  children,
}: ChatProvidersLayoutProps) {
  return <ChatProviders>{children}</ChatProviders>;
}
