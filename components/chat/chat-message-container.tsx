import { PaxChatContext } from '@/context/chat-context';
import { useContext, useEffect, useRef } from 'react';
import ChatMessage from './chat-message';
import { ScrollArea } from '../ui/scroll-area';
import deleteMessage from '@/lib/server/chat/deleteMessage';
import toast from 'react-hot-toast';
import { useTranslations } from 'next-intl';
import { ConfirmModal } from '../common/confirm-modal';
import { set } from 'lodash';

export default function ChatMessageContainer() {
  const t = useTranslations('chatting');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    setMessages,
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
  } = useContext(PaxChatContext);

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

    if (window && window.document) {
      (
        window.document.querySelector(
          'textarea#chat-message-input'
        ) as HTMLTextAreaElement | null
      )?.focus();
    }
  };

  const handleMessageReply = async (id: string) => {
    setIsReplying(true);
    setReplyMessageId(id);
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
    scrollToEnd();
  }, [messages]);

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
        className='w-full rounded-none bg-background p-4 pb-0 pt-2'
        style={{
          height: `calc(${chatWindowHeight})`,
        }}
      >
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
                        scrollToMessage={scrollToMessage}
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
                      scrollToMessage={scrollToMessage}
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
