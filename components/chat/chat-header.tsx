'use client';

import ChatRoomDropdown from '@/components/chat/chat-room-dropdown';
import { Button } from '@/components/ui/button';
import { PaxChatContext } from '@/context/chat-context';
import { MoveLeft } from 'lucide-react';
import { useFormatter } from 'next-intl';
import Image from 'next/image';
import { useContext } from 'react';
import { IoMdMore } from 'react-icons/io';
import TypingDots from './typing-dots';

export default function ChatHeader() {
  const { setShowSidebar, showNav, setShowNav, chatUser, currentTime } =
    useContext(PaxChatContext);

  const format = useFormatter();

  return (
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
          {chatUser?.isTyping ? (
            <>
              is typing
              <TypingDots />
            </>
          ) : chatUser?.online ? (
            'online'
          ) : (
            'last seen ' +
            format.relativeTime(
              chatUser?.lastOnlineTimestamp
                ? new Date(chatUser?.lastOnlineTimestamp) > currentTime
                  ? currentTime
                  : new Date(chatUser?.lastOnlineTimestamp)
                : currentTime,
              currentTime
            )
          )}
        </p>
      </div>
      <div className='ml-auto'>
        <ChatRoomDropdown>
          <Button variant='ghost' size='icon' className='rounded-full'>
            <IoMdMore size={20} />
          </Button>
        </ChatRoomDropdown>
      </div>
    </div>
  );
}
