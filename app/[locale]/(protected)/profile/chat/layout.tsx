import ChatProviders from '@/provider/chat-provider';

interface ChatProvidersLayoutProps {
  children: React.ReactNode;
}

export default function ChatProvidersLayout({
  children,
}: ChatProvidersLayoutProps) {
  return <ChatProviders>{children}</ChatProviders>;
}
