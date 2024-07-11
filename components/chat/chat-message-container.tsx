import { ChatMessageType, PaxChatContext } from '@/context/chat-context';
import deleteMessage from '@/lib/server/chat/deleteMessage';
import getMessages from '@/lib/server/chat/getMessages';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useInView } from 'react-intersection-observer';
import { ConfirmModal } from '../common/confirm-modal';
import { ScrollArea } from '../ui/scroll-area';
import ChatMessage from './chat-message';
import { Button } from '../ui/button';
import { IoArrowDown } from 'react-icons/io5';
import { cn } from '@/lib/utils';
import eventBus from '@/eventBus';
import { PaxContext } from '@/context/context';

export default function ChatMessageContainer() {
  const t = useTranslations('chatting');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { ref: loaderRef, inView } = useInView();
  const { user } = useContext(PaxContext);
  const {
    messages,
    setMessages,
    activeRoom,
    showSidebar,
    chatRooms,
    chatUser,
    isMessageLoading,
    isRoomLoading,
    setInputMessage,
    isDeleting,
    deleteMessageId,
    setDeleteMessageId,
    setIsDeleting,
    setIsEditing,
    setEditMessageId,
    setIsReplying,
    setReplyMessageId,
    chatWindowHeight,
    prevScrollHeight,
    setPrevScrollHeight,
  } = useContext(PaxChatContext);
  const [firstLoading, setFirstLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const loadMessages = useCallback(
    async (end_msg_id?: string) => {
      setIsLoading(true);

      try {
        const res = await getMessages(
          activeRoom,
          Number(messages.length || 0),
          (end_msg_id = end_msg_id ? end_msg_id : undefined)
        );

        const _chatUser =
          chatRooms.find((room) => room.id === activeRoom)?.user || null;

        if (_chatUser?.bot) {
          setMessages([
            {
              id: new Date().getTime().toString(),
              message: t('bot_default_msg', {
                bot_name: `@${_chatUser?.profile.name}`,
              }),
              timestamp: new Date().toLocaleString(),
              owner: {
                id: _chatUser?.id || '',
                name: _chatUser?.profile.name || '',
                avatar: _chatUser?.profile.avatar || '',
              },
            },
          ]);
        } else {
          const _messages =
            res.messages.map((msg) => {
              return {
                ...msg,
                parentMessage: msg.parentMessage
                  ? {
                      id: msg.parentMessage.id,
                      owner: {
                        id: msg.parentMessage.owner.id,
                        name:
                          _chatUser?.id === msg.parentMessage.owner.id
                            ? _chatUser?.profile.name || ''
                            : user?.username || '',
                        avatar:
                          _chatUser?.id === msg.parentMessage.owner.id
                            ? _chatUser?.profile.avatar || ''
                            : user?.avatar || '',
                      },
                      message: msg.parentMessage.message,
                    }
                  : undefined,
              };
            }) || ([] as ChatMessageType[]);
          setMessages((prevMessages) => [..._messages, ...prevMessages]);
        }

        setHasMore(res.total > res.skip + res.messages.length);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeRoom, chatRooms, messages.length, t, user?.avatar, user?.username, setMessages]
  );

  const getScrollHeight = () => {
    if (scrollAreaRef.current) {
      return scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )!.scrollHeight;
    } else {
      return 0;
    }
  };

  const scrollToEnd = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )!.scrollTop = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )!.scrollHeight;

      console.log('scroll to end');
    }
  };

  const scrollTo = (top: number) => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      )!.scrollTop += top;
    }
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

  const handleMessageEdit = async (id: string) => {
    setIsEditing(true);
    setEditMessageId(id);
    setInputMessage(
      messages.find((message) => message.id === id)?.message || ''
    );

    setIsReplying(false);
    setReplyMessageId('');
  };

  const handleMessageReply = async (id: string) => {
    setIsReplying(true);
    setReplyMessageId(id);

    setIsEditing(false);
    setEditMessageId('');
  };

  const handleMessageDelete = async (id: string) => {
    setIsDeleting(true);
    setDeleteMessageId(id);
  };

  const handleMessageDeleteSubmit = async () => {
    if (deleteMessageId === '') return;

    try {
      const res = await deleteMessage({ messageId: deleteMessageId });

      if (res?.status === 'success') {
        const index = messages.findIndex((msg) => msg.id === deleteMessageId);

        if (index > -1) {
          const _messages = messages;
          _messages[index].isDeleted = true;

          setMessages(_messages);

          setIsDeleting(false);
          setDeleteMessageId('');
        }
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

  useEffect(() => {
    if (!isMessageLoading && !isRoomLoading) {
      scrollToEnd();
      // autoHeight();
    }
  }, [isMessageLoading, isRoomLoading]);

  useEffect(() => {
    if (firstLoading && messages.length > 0) {
      scrollToEnd();
      setFirstLoading(false);
    }

    const deltaHeight = getScrollHeight() - prevScrollHeight;

    if (deltaHeight > 0) {
      scrollTo(deltaHeight);
    }
  }, [messages, firstLoading, prevScrollHeight]);

  useEffect(() => {
    if (inView) {
      setPrevScrollHeight(getScrollHeight());
      !isLoading && loadMessages();
    }
  }, [inView, isLoading, loadMessages, setPrevScrollHeight]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollAreaElement = scrollAreaRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      );

      if (scrollAreaElement) {
        scrollAreaElement.scrollTop =
          scrollAreaElement.scrollHeight - scrollPosition - scrollAreaRef.current.clientHeight;
      }
    }
  }, [chatWindowHeight, scrollPosition]);

  useEffect(() => {
    setMessages([]);
    setIsReplying(false);
    setReplyMessageId('');
    setIsEditing(false);
    setEditMessageId('');
  }, [activeRoom, setEditMessageId, setIsEditing, setIsReplying, setMessages, setReplyMessageId]);

  useEffect(() => {
    if (window === undefined) return;

    const checkScrollDown = () => {
      if (scrollAreaRef.current) {
        const scrollAreaElement = scrollAreaRef.current.querySelector(
          '[data-radix-scroll-area-viewport]'
        );

        if (scrollAreaElement) {
          const { scrollTop, scrollHeight, clientHeight } = scrollAreaElement;

          setShowScrollDown(scrollTop + clientHeight + 30 < scrollHeight);

          setScrollPosition(
            scrollHeight - scrollTop - scrollAreaRef.current!.clientHeight
          );
        }
      }
    };

    const scrollAreaElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );

    if (scrollAreaElement) {
      scrollAreaElement.addEventListener('scroll', checkScrollDown);
    }

    return () => {
      if (scrollAreaElement) {
        scrollAreaElement.removeEventListener('scroll', checkScrollDown);
      }
    };
  }, []);

  useEffect(() => {
    eventBus.on('scrollToMessage', async (data: any) => {
      if (messages.find((msg) => msg.id === data.id)?.id) {
        scrollToMessage(data.id);
      } else {
        await loadMessages(data.id);
        setTimeout(() => {
          scrollToMessage(data.id);
        }, 300);
      }
    });

    return () => {
      eventBus.off('scrollToMessage');
    };
  });

  let lastDay: string | null = null;

  return (
    <>
      <Button
        size='icon'
        className={cn(
          'fixed bottom-36 right-4 z-50 size-12 translate-y-60 rounded-full transition-transform duration-500 ease-in-out',
          {
            'translate-y-0': showScrollDown,
            '-translate-x-[300px]': showSidebar,
          }
        )}
        onClick={() => {
          scrollToEnd();
        }}
      >
        <IoArrowDown className='size-5' />
      </Button>
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
        className='relative w-full rounded-none bg-background p-4 pb-0 pt-2'
        style={{
          height: `calc(${chatWindowHeight})`,
        }}
      >
        {hasMore && (
          <div className='flex w-full items-center justify-center gap-2'>
            <Loader2 className='size-4 animate-spin' ref={loaderRef} />
            <span className='!text-sm text-muted-foreground'>
              {t('loading_messages')}
            </span>
          </div>
        )}
        <div className='wrapper h-full items-end'>
          <div className='chat-area container !px-0'>
            <div className='chat-area-main'>
              {messages.map((message) => {
                const day = new Date(message.timestamp).toLocaleDateString(
                  'en-US',
                  {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }
                );
                if (!chatUser?.bot && day !== lastDay) {
                  lastDay = day;
                  return (
                    <div key={message.id}>
                      <div className='my-2 w-full text-center text-sm text-muted-foreground'>
                        {day}
                      </div>
                      <ChatMessage
                        {...message}
                        onDelete={handleMessageDelete}
                        onEdit={handleMessageEdit}
                        onReply={handleMessageReply}
                        isBot={chatUser?.bot}
                      />
                    </div>
                  );
                } else
                  return (
                    <ChatMessage
                      key={message.id}
                      {...message}
                      onDelete={handleMessageDelete}
                      onEdit={handleMessageEdit}
                      onReply={handleMessageReply}
                      isBot={chatUser?.bot}
                    />
                  );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
