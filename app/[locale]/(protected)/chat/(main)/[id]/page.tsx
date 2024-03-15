'use client';

import { ConfirmModal } from '@/components/common/confirm-modal';
import ChatMessage from '@/components/dialogs/chat-message';
import ChatMessageSkeleton from '@/components/dialogs/chat-message-skeleton';
import { Button } from '@/components/ui/button';
import DropdownMenuDemo from '@/components/ui/chatmenu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaxChatContext } from '@/context/chat-context';
import { PaxContext } from '@/context/context';
import deleteMessage from '@/lib/server/chat/deleteMessage';
import editMessage from '@/lib/server/chat/editMessage';
import sendMessage from '@/lib/server/chat/sendMessage';
import subscribe from '@/lib/server/chat/subscribe';
import { cn, readFileAsDataURL } from '@/lib/utils';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Howl, Howler } from 'howler';
import { MoveLeft } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { IoCheckmarkSharp, IoSendOutline } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';

Howler.autoUnlock = true;

const PreviewFile = ({
  file,
  className,
  onRemove,
}: {
  file: File;
  className?: string;
  onRemove?: () => void;
}) => {
  const [type, setType] = useState('');
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (!file) {
      return;
    }

    setType(file.type);

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      setPreview(reader.result as string);
    };
  }, [file]);

  return (
    <div
      className={cn(
        'relative mb-2 size-16 overflow-hidden rounded-sm bg-white',
        className
      )}
    >
      {onRemove && (
        <Button
          variant='destructive'
          className='absolute right-1 top-1 z-10 size-4 rounded-full'
          type='button'
          size='icon'
          onClick={onRemove}
        >
          <LiaTimesSolid className='size-3' />
        </Button>
      )}
      {type.startsWith('image') && preview && (
        <Image src={preview} alt='' style={{ objectFit: 'cover' }} fill />
      )}
    </div>
  );
};

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
    showNav,
    setShowNav,
    messages,
    setMessages,
    chatRooms,
    setChatRooms,
    activeRoom,
    setActiveRoom,
    chatUser,
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
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [chatWindowHeight, setChatWindowHeight] = useState(
    '100vh - 5rem - 20px - 68px'
  );

  const messageSentSound = new Howl({
    src: ['/audio/message-sent.mp3'],
    html5: true,
    loop: false,
    preload: true,
  });



  const handleMessageSubmit = async (inputMessage: string) => {
    if (inputMessage.trim() === '') return;

    // In case of chatting with bot
    if (chatUser?.bot) {
      const attachments: {
        id: string;
        name: string;
        type: string;
        url: string;
      }[] = [];

      const _messages = messages;

      let fileSize = 0;

      if (uploadedFiles.length > 0) {
        for (let i = 0; i < uploadedFiles.length; i++) {
          if (uploadedFiles[i].type.startsWith('image')) {
            fileSize += uploadedFiles[i].size;
            const url = (await readFileAsDataURL(uploadedFiles[i])) as string;
            attachments.push({
              id: `${i}`,
              name: uploadedFiles[i].name,
              type: uploadedFiles[i].type,
              url: url,
            });
          }
        }

        if (fileSize > 1024 * 1024) {
          toast.error(t('image_size_too_big'), {
            position: 'top-right',
          });

          return;
        }

        _messages.push({
          id: new Date().getTime().toString(),
          message: inputMessage,
          attachments: attachments,
          timestamp: new Date().toISOString(),
          owner: {
            id: user?.id || '',
            name: user?.username || '',
            avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${user?.avatar}`,
          },
        });
      } else {
        _messages.push({
          id: new Date().getTime().toString(),
          message: inputMessage,
          timestamp: new Date().toISOString(),
          owner: {
            id: user?.id || '',
            name: user?.username || '',
            avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${user?.avatar}`,
          },
        });
      }
      
      setMessages(_messages);

      // Clear input message and uploaded files
      setInputMessage('');
      setUploadedFiles([]);

      // Play message sent sound
      messageSentSound.play();

  

      const bodyData: { [key: string]: any } = {
        lang: locale,
      };

      if (attachments.length > 0) {
        bodyData['content'] = _messages.slice(-1)[0].message;
        bodyData['images'] = attachments.map((a) => a.url.split(',')[1]);
      } else {
        bodyData['profile'] = {
          categories: chatUser?.profile.categories || [],
          bio: chatUser?.profile.bio || '',
        };
        bodyData['history'] = [
          ..._messages
            .filter(
              (msg) =>
                !(msg.attachments && msg.attachments.length > 0) &&
                !msg.isDeleted
            )
            .map((msg) => {
              return {
                role: msg.owner.id === user?.id ? 'user' : 'assistant',
                content: msg.message,
              };
            }),
        ];
      }

      try {
        const res = await fetch(
          `/api/chatbot/chat-stream?mode=${attachments.length > 0 ? 'image' : 'text'}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
          }
        );

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
            timestamp: new Date().toLocaleString(),
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
              streamText +=
                attachments.length > 0
                  ? parsedData.response
                  : parsedData.message.content;

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
      // In case of chatting with user
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

    if (textareaRef.current) {
      textareaRef.current.focus();
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

  const autoHeight = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = '68px';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    setChatWindowHeight(
      `100vh - 5rem - 20px - ${Math.min(textareaRef.current.scrollHeight, 200)}px${uploadedFiles.length > 0 ? ' - 4.5rem' : ''}`
    );
  };

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRoomCreate = (link: string) => {
    handleMessageSubmit(link);
  };

  useEffect(() => {
    autoHeight();
  }, [uploadedFiles]);

  useEffect(() => {
    setActiveRoom(id);
  }, []);

  useEffect(() => {
    if (uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        if (file.type.startsWith('image')) {
          const reader = new FileReader();

          reader.onload = () => {
            const imgData = reader.result as string;
          };
        }
      }
    }
  }, [uploadedFiles]);

  let lastDay: string | null = null;

  return !isMessageLoading && !isRoomLoading ? (
    <div className='new-content-container'>
      <div className='new-main-content'>
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

        {!showNav && (
          <Button
            variant='ghost'
            size='icon'
            className='absolute left-4 top-[5px] z-10 lg:left-9'
            onClick={() => setShowNav(!showNav)}
          >
            <MoveLeft size='24' />
          </Button>
        )}
        <div className='flex px-4 py-2 justify-center bg-card-gradient-menu'>
        Name
        </div>
        <ScrollArea
          ref={scrollAreaRef}
          className='w-full rounded-none bg-background p-4 pb-0 pt-2'
          style={{
            height: `calc(${chatWindowHeight})`,
          }}
        >
          <div className='wrapper h-full items-end'>
            <div className='chat-area container !px-0'>
              <div className='chat-area-main pb-[40px]'>
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
                      <>
                        <div
                          key={day}
                          className='w-full text-center text-sm text-muted-foreground'
                        >
                          {day}
                        </div>
                        <ChatMessage
                          key={message.id}
                          {...message}
                          onDelete={handleMessageDelete}
                          onEdit={handleMessageEdit}
                          isBot={chatUser?.bot}
                          isEdited={message.isEdited}
                        />
                      </>
                    );
                  } else
                    return (
                      <ChatMessage
                        key={message.id}
                        {...message}
                        onDelete={handleMessageDelete}
                        onEdit={handleMessageEdit}
                        isBot={chatUser?.bot}
                      />
                    );
                })}
              </div>
            </div>
          </div>
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
            <div className='flex justify-between bg-card-gradient-menu'>
              <div className='flex h-auto items-end px-4 py-2'>
                <DropdownMenuDemo
                  onFileUpload={handleFileUpload}
                  onRoomCreate={handleRoomCreate}
                >
                  <Button variant='ghost' size='icon' className=''>
                    <HamburgerMenuIcon />
                  </Button>
                </DropdownMenuDemo>
              </div>
              <div className='mb-[10px] ml-[10px] mt-[10px] flex h-full w-full flex-col justify-end'>
                <div className='flex w-full max-w-full gap-2 overflow-hidden'>
                  {uploadedFiles.length > 0 &&
                    uploadedFiles.map((file, index) => {
                      return (
                        <PreviewFile
                          key={index}
                          file={file}
                          onRemove={() => handleFileRemove(index)}
                        />
                      );
                    })}
                </div>
                <textarea
                  ref={textareaRef}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className='h-[68px] max-h-[200px] w-full rounded-xl bg-card-gradient-menu-on p-2'
                  onInput={autoHeight}
                />
              </div>
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
                  onClick={() => handleMessageSubmit(inputMessage)}
                  className='mx-2 mb-[10px] mt-auto'
                >
                  <IoSendOutline color='gray' size={18} />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className='new-content-container'>
      <div className='new-main-content'>
        <div className='h-[calc(100vh-5rem)] w-full overflow-hidden rounded-none bg-background p-4 pb-0 pt-2'>
          <div className='wrapper'>
            <div className='chat-area container !px-0'>
              <div className='chat-area-main'>
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='right' />
                <ChatMessageSkeleton position='right' />
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='right' />
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='left' />
                <ChatMessageSkeleton position='right' />
                <ChatMessageSkeleton position='right' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
