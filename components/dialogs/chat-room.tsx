'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ChatRoom, PaxChatContext } from '@/context/chat-context';
import eventBus from '@/eventBus';
import subscribe from '@/lib/server/chat/subscribe';
import unsubscribe from '@/lib/server/chat/unsubscribe';
import { cn } from '@/lib/utils';
import { usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { FaTrashCan } from 'react-icons/fa6';
import { MdOutlineMarkChatRead } from 'react-icons/md';
import { ConfirmModal } from '../common/confirm-modal';
import { Badge } from '../ui/badge';

export default function ChatRoom({ room }: { room: ChatRoom }) {
  const t = useTranslations('chatting');
  const pathname = usePathname();
  const { activeRoom, setActiveRoomSubscribed, setChatRooms } =
    useContext(PaxChatContext);
  const [isLeavingChat, setIsLeavingChat] = useState(false);

  const handleAcceptChat = async () => {
    try {
      const res = await subscribe(room.id);

      if (res?.status === 'success') {
        setChatRooms((chatRooms) => {
          const index = chatRooms.findIndex((_room) => _room.id === room.id);
          chatRooms[index].subscribed = true;

          return chatRooms;
        });

        if (room.id === activeRoom) setActiveRoomSubscribed(true);
      }
    } catch (error) {}
  };

  const handleLeaveChat = async () => {
    try {
      const res = await unsubscribe(room.id);

      if (res?.status === 'success') {
        setChatRooms((chatRooms) => {
          const index = chatRooms.findIndex((_room) => _room.id === room.id);
          chatRooms[index].subscribed = false;

          return chatRooms;
        });

        if (room.id === activeRoom) setActiveRoomSubscribed(false);
      }
    } catch (error) {
    } finally {
      setIsLeavingChat(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={isLeavingChat}
        onClose={() => {
          setIsLeavingChat(false);
        }}
        title={t('leave_chat')}
        description={t('are_you_sure_leave_chat')}
        onConfirm={() => {
          handleLeaveChat();
        }}
        loading={false}
      />
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <Link
            onClick={() => eventBus.emit('startChat')}
            key={room.id}
            href='/profile/chat/[id]'
            as={`/profile/chat/${room.id}`}
            className={cn(
              'flex w-full items-center gap-x-2 px-5 py-2 transition-colors duration-200 hover:bg-card-gradient-menu focus:outline-none',
              {
                'bg-card-gradient-menu': pathname.split('chat/')[1] === room.id,
              }
            )}
          >
            <div className='relative size-8 min-w-8'>
              <Image
                className='size-8 rounded-full'
                fill
                style={{ objectFit: 'cover' }}
                src={room.user.avatar}
                alt={room.user.name}
              />
              {room.user.online && (
                <span className='absolute bottom-0 right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white'></span>
              )}
            </div>

            <div className='text-left rtl:text-right'>
              <div className='flex text-sm font-medium text-gray-700 dark:text-white'>
                <p className='line-clamp-1 max-w-36'>{room.user.name}</p>
                {room.user.bot && (
                  <Badge
                    variant='outline'
                    className='m-0 ml-1.5 rounded-full border-primary py-0 text-xs font-normal text-primary'
                  >
                    BOT
                  </Badge>
                )}
              </div>
              <p className='line-clamp-1 text-xs text-gray-500 dark:text-gray-400'>
                {room.lastMessage.message}
              </p>
            </div>
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent className='w-48'>
          {!room.subscribed && (
            <ContextMenuItem
              className='cursor-pointer'
              onClick={handleAcceptChat}
            >
              <MdOutlineMarkChatRead className='mr-2 size-4' />
              {t('accept_chat')}
              {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
            </ContextMenuItem>
          )}
          {room.subscribed && (
            <ContextMenuItem
              className='cursor-pointer text-red-500 hover:!text-red-500'
              onClick={() => setIsLeavingChat(true)}
            >
              <FaTrashCan className='mr-2 size-4' />
              {t('leave_chat')}
              {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </>
  );
}
