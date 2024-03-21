'use client';

import ChatInputComponent from '@/components/chat/chat-input';
import ChatMessageContainer from '@/components/chat/chat-message-container';
import ChatMessageSkeleton from '@/components/chat/chat-message-skeleton';
import { Button } from '@/components/ui/button';
import { PaxChatContext } from '@/context/chat-context';
import subscribe from '@/lib/server/chat/subscribe';
import { Howler } from 'howler';
import { MoveLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useContext, useEffect } from 'react';
import { IoMdMore } from 'react-icons/io';

Howler.autoUnlock = true;

export default function ChatDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const t = useTranslations('chatting');
  const {
    showNav,
    setShowNav,
    setShowSidebar,
    setChatRooms,
    setActiveRoom,
    chatUser,
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
    } catch (error) {}
  };

  useEffect(() => {
    setActiveRoom(id);
  }, []);

  return !isMessageLoading && !isRoomLoading ? (
    <div className='new-content-container'>
      <div className='new-main-content'>
        <div className='flex items-center gap-2 bg-card-gradient-menu px-4 py-2'>
          {!showNav && (
            <Button
              variant='ghost'
              size='icon'
              className=''
              onClick={() => setShowNav(!showNav)}
            >
              <MoveLeft size='24' />
            </Button>
          )}
          <div className='relative size-12 min-w-12'>
            <Image
              className='size-8 rounded-full'
              fill
              style={{ objectFit: 'cover' }}
              src={chatUser?.profile.avatar || ''}
              alt={chatUser?.profile.name || ''}
            />
          </div>
          <div
            className='flex cursor-pointer flex-col justify-center'
            onClick={() => setShowSidebar(true)}
          >
            <p>@{chatUser?.profile.name || ''}</p>
            <p className='text-xs text-gray-500'>
              {chatUser?.online ? 'online' : 'offline'}
            </p>
          </div>
          <div className='ml-auto'>
            <Button variant='ghost' size='icon' className='rounded-full'>
              <IoMdMore size={20} />
            </Button>
          </div>
        </div>
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
