'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ChatRoomType, PaxChatContext } from '@/context/chat-context';
import { PaxContext } from '@/context/context';
import eventBus from '@/eventBus';
import subscribe from '@/lib/server/chat/subscribe';
import unsubscribe from '@/lib/server/chat/unsubscribe';
import { cn } from '@/lib/utils';
import { usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { BsCheck2All } from 'react-icons/bs';
import { FaTrashCan } from 'react-icons/fa6';
import { MdOutlineMarkChatRead, MdOutlineMarkChatUnread } from 'react-icons/md';
import { ConfirmModal } from '../common/confirm-modal';
import { Badge } from '../ui/badge';
import markAsRead from '@/lib/server/chat/markAsRead';
import markAsUnRead from '@/lib/server/chat/markAsUnread';
import toast from 'react-hot-toast';
import TypingDots from './typing-dots';

export default function ChatRoom({ room }: { room: ChatRoomType }) {
  const t = useTranslations('chatting');
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useContext(PaxContext);
  const { activeRoom, setActiveRoomSubscribed, setChatRooms } =
    useContext(PaxChatContext);
  const [isLeavingChat, setIsLeavingChat] = useState(false);

  const handleAcceptChat = async () => {
    try {
      const res = await subscribe(room.id);

      if (res?.status === 'success') {
        setChatRooms((chatRooms) => {
          const index = chatRooms.findIndex((_room) => _room.id === room.id);

          if (index > -1) chatRooms[index].subscribed = true;

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
          const newChatRooms = chatRooms.filter(
            (_room) => _room.id !== room.id
          );

          return newChatRooms;
        });

        if (room.id === activeRoom) router.push('/chat');
      }
    } catch (error) {
    } finally {
      setIsLeavingChat(false);
    }
  };

  const handleRoomClick = () => {
    if (window.innerWidth < 768) {
      eventBus.emit('startChat');
    }
  };

  const handleMarkAsRead = async (id: string) => {
    console.log('MARK AS READ', room.id, id);
    markAsRead(room.id, id);

    if (room.isUnread) {
      const res = await markAsRead(room.id);

      if (res?.success) {
        setChatRooms((chatRooms) => {
          const index = chatRooms.findIndex((_room) => _room.id === room.id);

          if (index > -1) chatRooms[index].isUnread = false;

          return chatRooms;
        });
      } else {
        toast.error(t('chat_mark_read_error'), {
          position: 'top-right',
        });
      }
    }
  };

  const handleMarkAsUnread = async () => {
    console.log('MARK AS UNREAD', activeRoom);
    const res = await markAsUnRead(room.id);

    if (res?.success) {
      setChatRooms((chatRooms) => {
        const index = chatRooms.findIndex((_room) => _room.id === room.id);

        if (index > -1) chatRooms[index].isUnread = true;

        return chatRooms;
      });
    } else {
      toast.error(t('chat_mark_unread_error'), {
        position: 'top-right',
      });
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
            onClick={() => handleRoomClick()}
            key={room.id}
            href='/chat/[id]'
            as={`/chat/${room.id}`}
            className={cn(
              'relative flex w-full items-center gap-x-2 px-5 py-2 transition-colors duration-200 hover:bg-card-gradient-menu focus:outline-none',
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
                src={room.user.profile.avatar}
                alt={room.user.profile.name}
              />
              {room.user.online && (
                <span className='absolute bottom-0 right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white'></span>
              )}
            </div>

            <div className='text-left rtl:text-right'>
              <div className='flex text-sm font-medium text-gray-700 dark:text-white'>
                <p className='line-clamp-1 max-w-36'>
                  {room.user.profile.name}
                </p>
                {room.user.bot && (
                  <Badge
                    variant='outline'
                    className='m-0 ml-1.5 rounded-full border-primary py-0 text-xs font-normal text-primary'
                  >
                    BOT
                  </Badge>
                )}
              </div>
              <p className='line-clamp-1 max-w-40 text-xs text-gray-500 dark:text-gray-400'>
                {room.user.isTyping ? (
                  <>
                    is typing
                    <TypingDots />
                  </>
                ) : (
                  <>
                    {room.lastMessage.owner === user?.id && !room.user.bot && (
                      <BsCheck2All
                        className={cn(
                          'mr-1 inline-block size-4 text-gray-500',
                          {
                            'text-primary':
                              Number(room.user.lastSeenMessage || 0) >=
                              Number(room.lastMessage.id),
                          }
                        )}
                      />
                    )}
                    {room.lastMessage.message}
                  </>
                )}
              </p>
            </div>
            {room.unreadCount > 0 ? (
              <Badge
                variant='default'
                className='absolute bottom-2 right-2 m-0 size-5 min-w-5 items-center justify-center rounded-full p-0.5 text-xs font-normal'
              >
                {room.unreadCount}
              </Badge>
            ) : room.isUnread ? (
              <Badge
                variant='default'
                className='absolute bottom-2 right-2 m-0 size-5 min-w-5 items-center justify-center rounded-full p-0.5 text-xs font-normal'
              ></Badge>
            ) : null}
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
          {(room.lastMessage.owner !== user?.id &&
            Number(room.lastMessage.id || 0) >
              Number(room.lastSeenMessage || 0)) ||
          room.isUnread ? (
            <ContextMenuItem
              className='cursor-pointer'
              onClick={() => handleMarkAsRead(`${room.lastMessage.id}`)}
            >
              <MdOutlineMarkChatRead className='mr-2 size-4' />
              {t('mark_as_read')}
              {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
            </ContextMenuItem>
          ) : (
            <ContextMenuItem
              className='cursor-pointer'
              onClick={() => handleMarkAsUnread()}
            >
              <MdOutlineMarkChatUnread className='mr-2 size-4' />
              {t('mark_as_unread')}
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
