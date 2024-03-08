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
import sendMessage from '@/lib/server/chat/sendMessage';
import subscribe from '@/lib/server/chat/subscribe';
import { Howl, Howler } from 'howler';
import { useLocale, useTranslations } from 'next-intl';
import {
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { IoCheckmarkSharp, IoSendOutline } from 'react-icons/io5';

Howler.autoUnlock = true;

// interface ChatMessage {
//   id: string;
//   message: string;
//   timestamp: string;
//   user: {
//     id: string;
//     name: string;
//     avatar: string;
//   };
//   isDeleted?: boolean;
//   isEdited?: boolean;
// }

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
    messages,
    setMessages,
    chatRooms,
    setChatRooms,
    activeRoom,
    setActiveRoom,
    activeRoomSubscribed,
    setActiveRoomSubscribed,
    isMessageLoading,
    isRoomLoading,
  } = useContext(PaxChatContext);
  const [inputMessage, setInputMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState('');
  const [editMessageId, setEditMessageId] = useState('');
  const [replyMessageId, setReplyMessageId] = useState('');

  const messageSentSound = new Howl({
    src: ['/audio/message-sent.mp3'],
    html5: true,
    loop: false,
    preload: true,
  });

  const handleMessageSubmit = async () => {
    if (inputMessage === '') return;

    const chatUser = chatRooms.find((room) => room.id === activeRoom)?.user;
    console.log(chatUser);

    if (chatUser?.bot) {
      const _messages = messages;
      _messages.push({
        id: new Date().getTime().toString(),
        message: inputMessage,
        timestamp: new Date().toLocaleTimeString(),
        owner: {
          id: user?.id || '',
          name: user?.username || '',
          avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${user?.avatar}`,
        },
      });

      setMessages(_messages);

      setInputMessage('');

      messageSentSound.play();

      try {
        const res = await fetch('/api/chatbot/chat-stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profile: {
              categories: chatUser?.profile.categories || [],
              bio: chatUser?.profile.bio || '',
            },
            history: [
              ..._messages.map((msg) => {
                return {
                  role: msg.owner.id === user?.id ? 'user' : 'assistant',
                  content: msg.message,
                };
              }),
            ],
            lang: locale,
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to fetch chat stream');
        }

        const id = new Date().getTime().toString();

        const reader = res.body?.getReader();
        const decoder = new TextDecoder('utf-8');

        if (!reader) return;

        setMessages([
          ..._messages,
          {
            id,
            message: '',
            timestamp: new Date().toLocaleTimeString(),
            owner: {
              id: chatUser?.id || '',
              name: chatUser?.profile.name || '',
              avatar: chatUser?.profile.avatar,
            },
          },
        ]);

        let streamText = '';
        let lastStreamText = '';

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          const rawText = decoder.decode(value);

          const lines = rawText.trim().split('\n');

          let parsedData = null;

          for (const line of lines) {
            try {
              parsedData = JSON.parse(line);
            } catch (error) {
              if (lastStreamText) {
                parsedData = JSON.parse(lastStreamText + line);
                lastStreamText = '';
              } else {
                lastStreamText = line;
              }
            }

            if (parsedData) {
              streamText += parsedData.message.content;

              console.log(parsedData.message.role);

              setMessages((previousMessages) => {
                const newMessages = previousMessages.map((msg) => {
                  if (msg.id === id) {
                    return { ...msg, message: streamText }; // Create a new object for the updated message
                  }
                  return msg;
                });
                return newMessages; // This is a new array reference
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const res = await sendMessage({ roomId: id, message: inputMessage });

        if (res?.status === 'success') {
          setInputMessage('');
          console.log(messages, '===');
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

          messageSentSound.play();
        } else {
          toast.error(t('failed_to_send_message'), {
            position: 'top-right',
          });
        }
      } catch (error) {
        console.log(error);
        toast.error(t('failed_to_send_message'), {
          position: 'top-right',
        });
      }
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
        toast.error(t('failed_to_delete_message'), {
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
        // const index = messages.findIndex((msg) => msg.id === editMessageId);

        // const _messages = messages;
        // _messages[index].message = res.data.message.Content;
        // _messages[index].isEdited = true;

        // setMessages(_messages);

        setIsEditing(false);
        setEditMessageId('');
        setInputMessage('');
      } else {
        toast.error(t('failed_to_edit_message'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscribe = async (roomId: string) => {
    try {
      const res = await subscribe(roomId);

      if (res?.status === 'success') {
        setChatRooms((chatRooms) => {
          const index = chatRooms.findIndex((room) => room.id === roomId);
          chatRooms[index].subscribed = true;

          return chatRooms;
        });

        setActiveRoomSubscribed(true);
      }
    } catch (error) {}
  };

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

  return !isMessageLoading && !isRoomLoading ? (
    <div>
      <ConfirmModal
        isOpen={isDeleting}
        onClose={() => {
          setIsDeleting(false);
          setDeleteMessageId('');
        }}
        title={t('delete_message')}
        description={t('are_you_sure_delete_message')}
        onConfirm={() => {
          handleMessageDeleteSubmit();
        }}
        loading={false}
      />

      <ScrollArea
        ref={scrollAreaRef}
        className='h-[calc(100vh_-_10.5rem)] w-full rounded-lg bg-background p-4 py-0'
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
        {activeRoomSubscribed && (
          <div className='flex justify-between'>
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
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
