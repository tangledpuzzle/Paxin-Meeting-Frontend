'use client';

import ChatHeader from '@/components/chat/chat-header';
import ChatInputComponent from '@/components/chat/chat-input';
import ChatMessageContainer from '@/components/chat/chat-message-container';
import ChatMessageSkeleton from '@/components/chat/chat-message-skeleton';
import { Button } from '@/components/ui/button';
import { PaxChatContext } from '@/context/chat-context';
import subscribe from '@/lib/server/chat/subscribe';
import { Howler } from 'howler';
import { useTranslations } from 'next-intl';
import { useContext, useEffect } from 'react';

Howler.autoUnlock = true;

export default function ChatDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const t = useTranslations('chatting');
  const {
    setChatRooms,
    setActiveRoom,
    activeRoomSubscribed,
    setActiveRoomSubscribed,
    isMessageLoading,
    isRoomLoading,
  } = useContext(PaxChatContext);

  const handleSubscribe = async (roomId: string) => {
    try {
      const res = await subscribe(roomId);

      if (res?.status === 'success') {
        setChatRooms((chatRooms) => {
          const index = chatRooms.findIndex((room) => room.id === roomId);

          if (index > -1) chatRooms[index].subscribed = true;

          return chatRooms;
        });

        setActiveRoomSubscribed(true);
      }
    } catch (error) {
      console.error('Failed to subscribe:', error); 
    }
  };

  useEffect(() => {
    setActiveRoom(id);
  }, [setActiveRoom, id]);

  return !isMessageLoading && !isRoomLoading ? (
    <div className='new-content-container'>
      <div className='new-main-content'>
        <ChatHeader />
        <ChatMessageContainer />
        <div className='chatInput'>
          {!activeRoomSubscribed && (
            <Button
              variant='ghost'
              onClick={() => {
                handleSubscribe(id);
              }}
              className='h-[100px] w-full'
            >
              {t('accept_chat')}
            </Button>
          )}
          {activeRoomSubscribed && <ChatInputComponent />}
        </div>
      </div>
    </div>
  ) : (
    <div className='new-content-container'>
      <div className='new-main-content'>
        <div className='h-[calc(100vh-5rem)] w-full overflow-hidden rounded-none bg-background p-4 pb-0 pt-2'>
          <div className='wrapper'>
            <div className='chat-area container !px-0'>
              <div className='chat-area-main'>
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='right' />
                <ChatMessageSkeleton position='right' />
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='right' />
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='right' />
                <ChatMessageSkeleton position='right' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
