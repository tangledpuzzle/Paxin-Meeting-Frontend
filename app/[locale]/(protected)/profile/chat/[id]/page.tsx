'use client';

import { ConfirmModal } from '@/components/common/confirm-modal';
import ChatMessage from '@/components/dialogs/chat-message';
import { Button } from '@/components/ui/button';
import DropdownMenuDemo from '@/components/ui/chatmenu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaxChatContext } from '@/context/chat-context';
import { PaxContext } from '@/context/context';
import deleteMessage from '@/lib/server/chat/deleteMessage';
import editMessage from '@/lib/server/chat/editMessage';
import getAllMessages from '@/lib/server/chat/getAllMessages';
import getRoomDetails from '@/lib/server/chat/getRoomDetails';
import sendMessage from '@/lib/server/chat/sendMessage';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { IoSendOutline } from 'react-icons/io5';
import { IoCheckmarkSharp } from 'react-icons/io5';
import { toast } from 'react-toastify';

interface ChatMessage {
  id: string;
  message: string;
  timestamp: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  isDeleted?: boolean;
  isEdited?: boolean;
}

export default function ChatDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useContext(PaxContext);
  // const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { messages, setMessages, setActiveRoom } = useContext(PaxChatContext);
  const [inputMessage, setInputMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState('');
  const [editMessageId, setEditMessageId] = useState('');
  const [replyMessageId, setReplyMessageId] = useState('');

  const handleMessageSubmit = async () => {
    if (inputMessage === '') return;

    try {
      const res = await sendMessage({ roomId: id, message: inputMessage });

      if (res?.status === 'success') {
        setInputMessage('');
        setMessages([
          ...messages,
          {
            id: `${res.data.message.ID}` as string,
            message: res.data.message.Content as string,
            owner: {
              id: user?.id as string,
              name: user?.username as string,
              avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${user?.avatar}`,
            },
            isDeleted: false,
            isEdited: true,
            timestamp: res.data.message.CreatedAt as string,
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleMessageDelete = useCallback(async (id: string) => {
    setIsDeleting(true);
    setDeleteMessageId(id);
  }, []);

  const handleMessageEdit = useCallback(
    async (id: string) => {
      console.log(id, messages);
      setIsEditing(true);
      setEditMessageId(id);
      setInputMessage(
        messages.find((message) => message.id === id)?.message || ''
      );
      // textareaRef.current?.focus();
    },
    [messages]
  );

  const handleMessageReply = useCallback(async (id: string) => {
    setIsReplying(true);
    setReplyMessageId(id);
    textareaRef.current?.focus();
  }, []);

  const handleMessageDeleteSubmit = async () => {
    if (deleteMessageId === '') return;

    try {
      const res = await deleteMessage({ messageId: deleteMessageId });

      if (res?.status === 'success') {
        const index = messages.findIndex((msg) => msg.id === deleteMessageId);

        const _messages = messages;
        _messages[index].isDeleted = true;

        setMessages(_messages);

        setIsDeleting(false);
        setDeleteMessageId('');
      } else {
        toast.error('Something went wrong', {
          position: 'top-right',
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
      setDeleteMessageId('');
    }
  };

  const handleMessageEditSubmit = async () => {
    if (inputMessage === '') return;
    if (editMessageId === '') return;

    try {
      const res = await editMessage({
        messageId: editMessageId,
        newMessage: inputMessage,
      });

      if (res?.status === 'success') {
        const index = messages.findIndex((msg) => msg.id === editMessageId);

        const _messages = messages;
        _messages[index].message = res.data.message.Content;
        _messages[index].isEdited = true;

        setMessages(_messages);

        setIsEditing(false);
        setEditMessageId('');
        setInputMessage('');
      } else {
        toast.error('Something went wrong', {
          position: 'top-right',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     getAllMessages({ roomId: id }).then((res) => {
  //       const _messages: ChatMessage[] = [];

  //       for (const item of res.data.messages) {
  //         _messages.push({
  //           id: `${item.ID}`,
  //           message: item.Content,
  //           timestamp: item.CreatedAt,
  //           user: {
  //             id: item.UserID,
  //             name: item.User.Name,
  //             avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${item.User.Photo}`,
  //           },
  //           isDeleted: item.IsDeleted,
  //           isEdited: item.IsEdited,
  //         });
  //       }

  //       _messages.sort((a, b) => {
  //         return (
  //           new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  //         );
  //       });

  //       setMessages(_messages);
  //     });
  //   }
  // }, [user]);

  const auto_height = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = '68px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    setActiveRoom(id);
  }, []);

  return (
    <div>
      <ConfirmModal
        isOpen={isDeleting}
        onClose={() => {
          setIsDeleting(false);
          setDeleteMessageId('');
        }}
        title={'Delete Message'}
        description={'Are you sure you want to delete this message?'}
        onConfirm={() => {
          handleMessageDeleteSubmit();
        }}
        loading={false}
      />
      <ScrollArea
        ref={scrollAreaRef}
        className='h-[calc(100vh_-_11rem)] w-full rounded-lg bg-background p-4'
      >
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            {...message}
            onDelete={handleMessageDelete}
            onEdit={handleMessageEdit}
          />
        ))}
      </ScrollArea>
      <div className='chatInput'>
        <div className='flex justify-between '>
          <DropdownMenuDemo />
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className='mb-[10px] ml-[10px] mt-[10px] h-[68px] max-h-[200px] w-full rounded-xl pb-2 pl-[10px] pr-[10px] pt-2'
            onInput={auto_height}
          ></textarea>
          {isEditing ? (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleMessageEditSubmit}
              className='mx-2 mb-[10px] mt-auto'
            >
              <IoCheckmarkSharp color='green' size={18} />
            </Button>
          ) : (
            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={handleMessageSubmit}
              className='mx-2 mb-[10px] mt-auto'
            >
              <IoSendOutline color='gray' size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
