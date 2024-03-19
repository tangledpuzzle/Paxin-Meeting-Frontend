'use client';

import MobileDetect from 'mobile-detect';
import { ConfirmModal } from '@/components/common/confirm-modal';
import ChatMessage from '@/components/chat/chat-message';
import ChatMessageSkeleton from '@/components/chat/chat-message-skeleton';
import { Button } from '@/components/ui/button';
import DropdownMenuDemo from '@/components/ui/chatmenu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaxChatContext } from '@/context/chat-context';
import { PaxContext } from '@/context/context';
import deleteMessage from '@/lib/server/chat/deleteMessage';
import editMessage from '@/lib/server/chat/editMessage';
import sendMessage from '@/lib/server/chat/sendMessage';
import subscribe from '@/lib/server/chat/subscribe';
import { cn, readFileAsDataURL } from '@/lib/utils';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Howl, Howler } from 'howler';
import { Loader2, MoveLeft } from 'lucide-react';
import eventBus from '@/eventBus';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoCheckmarkSharp, IoSendOutline } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';
import { IoMdMore } from 'react-icons/io';
import { BsCheck2, BsCheck2All, BsReply } from 'react-icons/bs';
import ChatInputComponent from '@/components/chat/chat-input';
import ChatMessageContainer from '@/components/chat/chat-message-container';

Howler.autoUnlock = true;

const PreviewFile = ({
  file,
  className,
  onRemove,
}: {
  file: File;
  className?: string;
  onRemove?: () => void;
}) => {
  const [type, setType] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!file) {
      return;
    }

    setType(file.type);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result as string);
    };
  }, [file]);

  const scrollToMessage = () => {
    const id = '522';
    alert(id);
    console.log('SCROLL TO MESSAGE', id);
    if (window && window.document) {
      const messageElement = window.document.getElementById(
        `chat-message-${id}`
      );
      if (messageElement)
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // eventBus.on('scrollToMessage', () => {
  //   alert(10);
  // });

  // useEffect(() => {
  //   const scrollToMessage = () => {
  //     const id = '522';
  //     alert(id);
  //     console.log('SCROLL TO MESSAGE', id);
  //     if (window && window.document) {
  //       const messageElement = window.document.getElementById(
  //         `chat-message-${id}`
  //       );
  //       if (messageElement)
  //         messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  //     }
  //   };

  //   eventBus.on('scrollToMessage', scrollToMessage);

  //   return () => {
  //     eventBus.off('scrollToMessage', scrollToMessage);
  //   };
  // }, []);

  return (
    <div
      className={cn(
        'relative mb-2 size-16 overflow-hidden rounded-sm bg-white',
        className
      )}
    >
      {onRemove && (
        <Button
          variant='destructive'
          className='absolute right-1 top-1 z-10 size-4 rounded-full'
          type='button'
          size='icon'
          onClick={onRemove}
        >
          <LiaTimesSolid className='size-3' />
        </Button>
      )}
      {type.startsWith('image') && preview && (
        <Image src={preview} alt='' style={{ objectFit: 'cover' }} fill />
      )}
    </div>
  );
};

export default function ChatDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const t = useTranslations('chatting');
  const locale = useLocale();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useContext(PaxContext);
  const {
    showNav,
    setShowNav,
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

  const scrollToMessage = (id: string) => {
    if (window && window.document) {
      const messageElement = window.document.getElementById(
        `chat-message-${id}`
      );
      if (messageElement)
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
          <div className='flex cursor-pointer flex-col justify-center'>
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
