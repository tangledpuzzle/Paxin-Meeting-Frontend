'use client';

import { Button } from '@/components/ui/button';
import DropdownMenuDemo from '@/components/ui/chatmenu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaxContext } from '@/context/context';
import getAllMessages from '@/lib/server/chat/getAllMessages';
import getRoomDetails from '@/lib/server/chat/getRoomDetails';
import sendMessage from '@/lib/server/chat/sendMessage';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import { IoSendOutline } from 'react-icons/io5';

interface ChatMessage {
  id: string;
  message: string;
  time: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function ChatDetailPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useContext(PaxContext);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');

  const handleMessageSubmit = async () => {
    if (inputMessage === '') return;

    try {
      const res = await sendMessage({ roomId: id, message: inputMessage });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMessages({ roomId: id }).then((res) => {
      const _messages: ChatMessage[] = [];

      for (const item of res.data.messages) {
        _messages.push({
          id: `${item.ID}`,
          message: item.Content,
          time: item.CreatedAt,
          user: {
            id: item.UserID,
            name: item.User.Name,
            avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${item.User.Photo}`,
          },
        });
      }

      _messages.sort((a, b) => {
        return new Date(a.time).getTime() - new Date(b.time).getTime();
      });

      setMessages(_messages);
    });
  }, [user]);

  const auto_height = () => {
    const textarea = textareaRef.current;

    if (textarea) {
      textarea.style.height = '68px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  return (
    <div>
      <ScrollArea
        ref={scrollAreaRef}
        className='h-[calc(100vh_-_11rem)] w-full rounded-lg bg-background p-4'
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('chat-msg', { owner: message.user.id === user?.id })}
          >
            <div className='chat-msg-profile'>
              <Image
                width={40}
                height={40}
                className='chat-msg-img'
                src={message.user.avatar}
                alt=''
              />
              <div className='chat-msg-date'>Message seen 2.45pm</div>
            </div>
            <div className='chat-msg-content'>
              <div
                className={cn('chat-msg-text', {
                  'bg-card-gradient-menu': message.user.id !== user?.id,
                })}
              >
                {message.message}
              </div>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className='chatInput'>
        <div className='flex justify-between '>
          <DropdownMenuDemo />
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className='mb-[10px] ml-[10px] mr-[40px] mt-[10px] h-[68px] max-h-[200px] w-full rounded-xl pb-2 pl-[10px] pr-[10px] pt-2'
            onInput={auto_height}
          ></textarea>
          <button
            type='button'
            onClick={handleMessageSubmit}
            className='absolute right-0 flex h-full cursor-pointer items-end justify-center pb-6 pr-3'
          >
            <IoSendOutline color='gray' size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
