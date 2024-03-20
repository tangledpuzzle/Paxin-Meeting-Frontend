import { PaxChatContext } from '@/context/chat-context';
import deleteMessage from '@/lib/server/chat/deleteMessage';
import getAllMessages from '@/lib/server/chat/getAllMessages';
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

export default function ChatMessageContainer() {
  const t = useTranslations('chatting');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { ref: loaderRef, inView } = useInView();
  const {
    messages,
    setMessages,
    activeRoom,
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

  const loadMessages = async () => {
    const res = await getAllMessages(activeRoom, Number(messages.length || 0));

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
    } else setMessages((messages) => [...res.messages, ...messages]);

    setHasMore(res.total > res.skip + res.messages.length);
  };

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

    let deltaHeight = getScrollHeight() - prevScrollHeight;

    if (deltaHeight > 0) {
      scrollTo(deltaHeight);
    }
  }, [messages]);

  useEffect(() => {
    if (inView) {
      setPrevScrollHeight(getScrollHeight());
      loadMessages();
    }
  }, [inView]);

  useEffect(() => {
    setMessages([]);
  }, [activeRoom]);

  useEffect(() => {
    if (window === undefined) return;

    const checkScrollDown = () => {
      if (scrollAreaRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollAreaRef.current.querySelector(
            '[data-radix-scroll-area-viewport]'
          )!;

        console.log(scrollTop, clientHeight, scrollHeight);

        setShowScrollDown(scrollTop + clientHeight + 30 < scrollHeight);
      }
    };

    scrollAreaRef.current &&
      scrollAreaRef.current
        .querySelector('[data-radix-scroll-area-viewport]')!
        .addEventListener('scroll', checkScrollDown);

    return () => {
      scrollAreaRef.current &&
        scrollAreaRef.current
          .querySelector('[data-radix-scroll-area-viewport]')!
          .removeEventListener('scroll', checkScrollDown);
    };
  }, []);

  let lastDay: string | null = null;

  return (
    <>
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
        <Button
          size='icon'
          className={cn(
            'absolute bottom-4 right-4 z-10 size-12 translate-y-40 rounded-full transition-transform duration-300 ease-in-out',
            {
              'translate-y-0': showScrollDown,
            }
          )}
          onClick={() => {
            scrollToEnd();
          }}
        >
          <IoArrowDown className='size-5' />
        </Button>
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
                        scrollToMessage={() => scrollToMessage(message.id)}
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
                      scrollToMessage={() => scrollToMessage(message.id)}
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
