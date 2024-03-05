'use client';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { BsReply } from 'react-icons/bs';
import { FaTrashCan } from 'react-icons/fa6';
import {
  MdOutlineContentCopy,
  MdOutlineDoNotDisturb,
  MdOutlineModeEditOutline,
} from 'react-icons/md';

interface ChatMessageProps {
  id: string;
  message: string;
  owner: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  isPinned?: boolean;
  isSent?: boolean;
  isReceived?: boolean;
  isSeen?: boolean;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export default function ChatMessage(props: ChatMessageProps) {
  const handleMessageCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);

    toast.success('Message copied to clipboard', {
      position: 'top-right',
    });
  };

  return (
    <div className={cn('chat-msg', { owner: props.owner === props.user.id })}>
      <div className='chat-msg-profile'>
        <Image
          width={40}
          height={40}
          className='chat-msg-img'
          src={props.user.avatar}
          alt={props.user.name}
        />
        <div className='chat-msg-date'>Message seen 2.45pm</div>
      </div>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div className='chat-msg-content'>
            <div
              className={cn('chat-msg-text flex items-center', {
                'bg-card-gradient-menu': props.owner !== props.user.id,
                '!text-gray-300': props.isDeleted,
              })}
            >
              {props.isDeleted ? (
                <>
                  <MdOutlineDoNotDisturb className='mr-2 size-4' />
                  This message has been deleted
                </>
              ) : (
                props.message
              )}
            </div>
          </div>
        </ContextMenuTrigger>
        {!props.isDeleted && (
          <ContextMenuContent className='w-48'>
            <ContextMenuItem className='cursor-pointer'>
              <BsReply className='mr-2 size-4' />
              Reply
              {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
            </ContextMenuItem>
            {props.owner === props.user.id && (
              <ContextMenuItem
                className='cursor-pointer'
                onClick={() => props.onEdit(props.id)}
              >
                <MdOutlineModeEditOutline className='mr-2 size-4' />
                Edit
                {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
              </ContextMenuItem>
            )}
            <ContextMenuItem
              className='cursor-pointer'
              onClick={() => handleMessageCopy(props.message)}
            >
              <MdOutlineContentCopy className='mr-2 size-4' />
              Copy Message
              {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
            </ContextMenuItem>
            {props.owner === props.user.id && (
              <ContextMenuItem
                className='cursor-pointer text-red-500 hover:!text-red-500'
                onClick={() => props.onDelete(props.id)}
              >
                <FaTrashCan className='mr-2 size-4' />
                Delete
                {/* <ContextMenuShortcut>⌘</ContextMenuShortcut> */}
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        )}
      </ContextMenu>
    </div>
  );
}
