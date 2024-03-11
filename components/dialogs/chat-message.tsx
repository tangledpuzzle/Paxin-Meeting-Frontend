'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { PaxContext } from '@/context/context';
import { cn } from '@/lib/utils';
import { useFormatter, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useContext } from 'react';
import toast from 'react-hot-toast';
import { BsReply } from 'react-icons/bs';
import { FaTrashCan } from 'react-icons/fa6';
import {
  MdOutlineContentCopy,
  MdOutlineDoNotDisturb,
  MdOutlineModeEditOutline,
} from 'react-icons/md';
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
  };
  timestamp: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  isPinned?: boolean;
  isSent?: boolean;
  isReceived?: boolean;
  isSeen?: boolean;
  isBot?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ChatMessage(props: ChatMessageProps) {
  const t = useTranslations('chatting');
  const { user } = useContext(PaxContext);
  const format = useFormatter();

  const handleMessageCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    toast.success(t('message_copied'), {
      position: 'top-right',
    });
  };

  return (
    <div className={cn('chat-msg', { owner: user?.id === props.owner.id })}>
      <div className='chat-msg-profile'>
        <Image
          width={40}
          height={40}
          className='chat-msg-img'
          src={props.owner.avatar}
          alt={props.owner.name}
        />
        {/* <div className='chat-msg-date'>Message seen 2.45pm</div> */}
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
              {props.isDeleted ? (
                <div className='mr-16 flex items-center gap-1'>
                  <MdOutlineDoNotDisturb className='size-4' />
                  <span className='select-none'>{t('message_deleted')}</span>
                </div>
              ) : (
                <ReactMarkdown
                  className='prose mr-16'
                  children={props.message}
                />
              )}
              <p className='-mt-2 w-full text-right text-xs text-gray-200'>
                {format.dateTime(new Date(props.timestamp), {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
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
