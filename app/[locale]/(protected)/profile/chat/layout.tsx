import ChatNavComponent from '@/components/dialogs/chat-nav';
import ChatProviders from '@/provider/chat-provider';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <ChatProviders>
      <ChatNavComponent />
      {children}
    </ChatProviders>
  );
}
