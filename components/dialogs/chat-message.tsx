'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { ChatRoomType, PaxChatContext } from '@/context/chat-context';
import { PaxContext } from '@/context/context';
import markAsRead from '@/lib/server/chat/markAsRead';
import { cn } from '@/lib/utils';
import DOMPurify from 'dompurify';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsCheck2, BsCheck2All, BsReply } from 'react-icons/bs';
import { FaTrashCan } from 'react-icons/fa6';
import { IoCheckmarkDone } from 'react-icons/io5';
import {
  MdOutlineContentCopy,
  MdOutlineDoNotDisturb,
  MdOutlineModeEditOutline,
} from 'react-icons/md';
import { PiChecksBold } from 'react-icons/pi';
import { TbChecks } from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  id: string;
  message: string;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  attachments?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
  timestamp: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  isPinned?: boolean;
  isSent?: boolean;
  isReceived?: boolean;
  isSeen?: boolean;
  isBot?: boolean;
  isPending?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ChatMessage(props: ChatMessageProps) {
  const t = useTranslations('chatting');
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useContext(PaxContext);
  const { activeRoom, chatRooms, isOnline } = useContext(PaxChatContext);
  const [currentChatRoom, setCurrentChatRoom] = useState<ChatRoomType | null>(
    null
  );
  const format = useFormatter();

  const handleMessageCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    toast.success(t('message_copied'), {
      position: 'top-right',
    });
  };

  const linkify = (inputText: string) => {
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    return inputText.replace(
      urlRegex,
      (url) =>
        `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );
  };

  const processText = (text: string) => {
    let processedText = linkify(text);

    // Handling newline characters by replacing them with the HTML line break.
    processedText = processedText.replace(/\n/g, '<br />');

    return processedText;
  };

  const handleMarkAsRead = async (id: string) => {
    console.log('MARK AS READ', activeRoom, id);

    try {
      const res = await markAsRead(activeRoom, id);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeRoom) {
      setCurrentChatRoom(
        chatRooms.find((chatRoom) => chatRoom.id === activeRoom) || null
      );
    }
  }, [activeRoom, chatRooms]);

  useEffect(() => {
    if (user?.id === props.owner.id || props.isBot || props.isSeen) return;

    if (Number(currentChatRoom?.lastSeenMessage || 0) >= Number(props.id))
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isOnline) {
            handleMarkAsRead(props.id);
            if (entry.target) observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Cleanup observer on component unmount
    return () => observer.disconnect();
  }, [props.id, currentChatRoom, isOnline]);

  return (
    <div
      className={cn('chat-msg', { owner: user?.id === props.owner.id })}
      ref={ref}
    >
      <div className='chat-msg-profile'>
        <Image
          width={40}
          height={40}
          className='chat-msg-img'
          src={props.owner.avatar}
          alt={props.owner.name}
        />
        {props.owner.id === user?.id && !props.isBot && (
          <div className='chat-msg-date'>
            {!props?.isPending ? (
              <BsCheck2All
                className={cn('size-5 text-gray-500', {
                  'text-primary':
                    Number(currentChatRoom?.user.lastSeenMessage || 0) >=
                    Number(props.id),
                })}
              />
            ) : (
              <BsCheck2 className='size-5 text-gray-500' />
            )}
          </div>
        )}
      </div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className='chat-msg-content'>
            <div
              className={cn('chat-msg-text', {
                'bg-card-gradient-menu': user?.id !== props.owner.id,
                '!text-gray-300': props.isDeleted,
              })}
            >
              {/** Display attachments */}
              <div className='flex items-center gap-1'>
                {props.attachments &&
                  props.attachments.length > 0 &&
                  props.attachments.map((attachment) => {
                    if (attachment.type.startsWith('image')) {
                      return (
                        <div key={attachment.id} className='relative size-12'>
                          <Image
                            src={attachment.url}
                            fill
                            style={{ objectFit: 'cover' }}
                            alt={attachment.name}
                          />
                        </div>
                      );
                    }
                  })}
              </div>
              {props.isDeleted ? (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    {
                      'mr-14': !props.isBot,
                    },
                    { 'mr-24': props.isEdited }
                  )}
                >
                  <MdOutlineDoNotDisturb className='size-4' />
                  <span className='select-none'>{t('message_deleted')}</span>
                </div>
              ) : props.isBot && props.owner.id !== user?.id ? (
                <ReactMarkdown
                  className={cn(
                    'prose',
                    {
                      'mr-14': !props.isBot,
                    },
                    { 'mr-24': props.isEdited }
                  )}
                  children={props.message}
                />
              ) : (
                <div
                  className={cn(
                    'flex items-center gap-1',
                    {
                      'mr-14': !props.isBot,
                    },
                    { 'mr-24': props.isEdited }
                  )}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      processText(props.id + ' ' + props.message),
                      {
                        ALLOWED_TAGS: ['a', 'br'],
                        ALLOWED_ATTR: ['href', 'target', 'rel'],
                      }
                    ),
                  }}
                />
              )}
              {!props.isBot && (
                <div className='-mt-3 flex w-full justify-end gap-1 text-xs text-gray-200'>
                  {props.isEdited && <p>{t('edited')}</p>}
                  <p>
                    {format.dateTime(new Date(props.timestamp), {
                      hour: 'numeric',
                      minute: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </ContextMenuTrigger>
        {!props.isDeleted && (
          <ContextMenuContent className='w-48'>
            <ContextMenuItem className='cursor-pointer'>
              <BsReply className='mr-2 size-4' />
              {t('reply')}
              {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
            </ContextMenuItem>
            {user?.id === props.owner.id && (
              <ContextMenuItem
                className='cursor-pointer'
                onClick={() => props.onEdit(props.id)}
              >
                <MdOutlineModeEditOutline className='mr-2 size-4' />
                {t('edit')}
                {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
              </ContextMenuItem>
            )}
            <ContextMenuItem
              className='cursor-pointer'
              onClick={() => handleMessageCopy(props.message)}
            >
              <MdOutlineContentCopy className='mr-2 size-4' />
              {t('copy_message')}
              {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
            </ContextMenuItem>
            {user?.id === props.owner.id && (
              <ContextMenuItem
                className='cursor-pointer text-red-500 hover:!text-red-500'
                onClick={() => props.onDelete(props.id)}
              >
                <FaTrashCan className='mr-2 size-4' />
                {t('delete')}
                {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
