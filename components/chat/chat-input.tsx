'use client';

import { Button } from '@/components/ui/button';
import DropdownMenuDemo from '@/components/ui/chatmenu';
import { PaxChatContext } from '@/context/chat-context';
import { PaxContext } from '@/context/context';
import eventBus from '@/eventBus';
import deleteMessage from '@/lib/server/chat/deleteMessage';
import editMessage from '@/lib/server/chat/editMessage';
import sendMessage from '@/lib/server/chat/sendMessage';
import { cn, readFileAsDataURL } from '@/lib/utils';
import { HamburgerMenuIcon } from '@radix-ui/react-icons';
import { Loader2 } from 'lucide-react';
import MobileDetect from 'mobile-detect';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useContext, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsReply } from 'react-icons/bs';
import { IoCheckmarkSharp, IoClose, IoSendOutline } from 'react-icons/io5';
import { LiaTimesSolid } from 'react-icons/lia';
import { MdOutlineEdit } from 'react-icons/md';

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

export default function ChatInputComponent() {
  const t = useTranslations('chatting');
  const locale = useLocale();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const {
    inputMessage,
    setInputMessage,
    messages,
    setMessages,
    chatUser,
    activeRoom,
    isLoadingSubmit,
    setIsLoadingSubmit,
    isDeleting,
    setIsDeleting,
    isEditing,
    setIsEditing,
    isReplying,
    setIsReplying,
    deleteMessageId,
    setDeleteMessageId,
    editMessageId,
    setEditMessageId,
    replyMessageId,
    setReplyMessageId,
    uploadedFiles,
    setUploadedFiles,
    setChatWindowHeight,
    setPrevScrollHeight,
  } = useContext(PaxChatContext);
  const { user } = useContext(PaxContext);
  const mdRef = useRef<MobileDetect | null>(null);

  const messageSentSound = new Howl({
    src: ['/audio/message-sent.mp3'],
    html5: true,
    loop: false,
    preload: true,
  });

  const handleFileUpload = (files: File[]) => {
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleFileRemove = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRoomCreate = (link: string) => {
    handleMessageSubmit(link, '1', { link });
  };

  const handleMessageSubmit = async (
    inputMessage: string,
    msgType: '0' | '1' | '2' = '0',
    jsonData?: any
  ) => {
    // inputMessage: string
    // msgType: 0 = text, 1 = conference link, 2 = attached post
    // jsonData: Object

    if (msgType === '0' && inputMessage.trim() === '') return;

    inputMessage = inputMessage.trim();

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
      setIsLoadingSubmit(true);

      // This is needed to scroll to the bottom after sending msg
      setPrevScrollHeight(0);

      const pendingId = '00000';

      setMessages([
        ...messages,
        {
          id: pendingId,
          parentMessageId:
            isReplying && replyMessageId ? replyMessageId : undefined,
          messageType: msgType || '0',
          message: inputMessage,
          customData: jsonData ? jsonData : undefined,
          owner: {
            id: user?.id as string,
            name: user?.username as string,
            avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${user?.avatar}`,
          },
          isDeleted: false,
          isEdited: false,
          isPending: true,
          timestamp: new Date().toISOString(),
        },
      ]);

      setInputMessage('');

      try {
        const res = await sendMessage({
          roomId: activeRoom,
          message: inputMessage,
          parentMessageId:
            isReplying && replyMessageId ? replyMessageId : undefined,
          msgType,
          customData: jsonData ? JSON.stringify(jsonData) : undefined,
        });

        if (res?.status === 'success') {
          setInputMessage('');

          setMessages((messages) => {
            const newMessages = messages.map((msg) => {
              if (msg.id === pendingId) {
                return {
                  ...msg,
                  id: res.data.message.ID,
                  parentMessageId: res.data.message.ParentMessageID
                    ? `${res.data.message.ParentMessageID}`
                    : undefined,
                  message: res.data.message.Content,
                  timestamp: res.data.message.CreatedAt,
                  isPending: false,
                }; // Create a new object for the updated message
              }
              return msg;
            });

            return newMessages; // This is a new array reference
          });

          setIsReplying(false);
          setReplyMessageId('');
          // setMessages([
          //   ...messages,
          //   {
          //     id: `${res.data.message.ID}` as string,
          //     message: res.data.message.Content as string,
          //     owner: {
          //       id: user?.id as string,
          //       name: user?.username as string,
          //       avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${user?.avatar}`,
          //     },
          //     isDeleted: false,
          //     isEdited: false,
          //     timestamp: res.data.message.CreatedAt as string,
          //   },
          // ]);

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
      } finally {
        setIsLoadingSubmit(false);
      }
    }

    // eventBus.emit('focusInput');

    // if (textareaRef.current) {
    //   textareaRef.current.focus();
    // }
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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
      const isMobile = mdRef.current && mdRef.current.mobile();

      if (!isMobile) {
        e.preventDefault();
        if (isEditing) {
          handleMessageEditSubmit();
        } else if (isReplying) {
          handleMessageSubmit(inputMessage);
        } else {
          handleMessageSubmit(inputMessage);
        }
      }
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault(); // Prevent the default action (submit form, etc.)

      // Get the current textarea and its selection positions
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert the newline character at the cursor's current position
      const newValue =
        inputMessage.substring(0, start) + '\n' + inputMessage.substring(end);

      // Update the state with the new value
      setInputMessage(newValue);

      // Move the cursor to right after the newly inserted newline
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }
  };

  const autoHeight = () => {
    if (!textareaRef.current) return;

    textareaRef.current.style.height = '68px';
    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    setChatWindowHeight(
      `100vh - 5rem - 20px - 4rem - ${Math.min(textareaRef.current.scrollHeight, 200)}px${uploadedFiles.length > 0 ? ' - 4.5rem' : ''} - ${isReplying && replyMessageId ? '4.5rem' : '0px'} - ${isEditing && editMessageId ? '4.5rem' : '0px'}`
    );
  };

  useEffect(() => {
    if (window !== undefined)
      mdRef.current = new MobileDetect(window.navigator.userAgent);
  }, []);

  useEffect(() => {
    autoHeight();
  }, [uploadedFiles, inputMessage, isReplying, replyMessageId]);

  useEffect(() => {
    setTimeout(() => textareaRef.current?.focus(), 100);
  }, [isReplying, replyMessageId, isEditing, editMessageId]);

  return (
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
        {isReplying && replyMessageId && (
          <div className='flex w-full items-center gap-4 py-1'>
            <BsReply className='size-6 min-w-6 text-primary' />
            <div
              className='mb-1 w-full cursor-pointer rounded-md border-l-4 border-primary bg-background/10 p-2'
              onClick={() => {
                eventBus.emit('scrollToMessage', { id: replyMessageId });
              }}
            >
              <span className='text-sm text-primary'>
                @
                {
                  messages.find((message) => message.id === replyMessageId)
                    ?.owner.name
                }
              </span>
              <p className='line-clamp-1 text-sm'>
                {
                  messages.find((message) => message.id === replyMessageId)
                    ?.message
                }
              </p>
            </div>
            <Button
              size='icon'
              variant='ghost'
              className='ml-auto size-8 min-w-8 rounded-full'
              onClick={() => {
                setIsReplying(false);
                setReplyMessageId('');
              }}
            >
              <IoClose size={18} />
            </Button>
          </div>
        )}
        {isEditing && editMessageId && (
          <div className='flex w-full items-center gap-4 py-1'>
            <MdOutlineEdit className='size-6 min-w-6 text-primary' />
            <div
              className='mb-1 w-full cursor-pointer rounded-md border-l-4 border-primary bg-background/10 p-2'
              onClick={() => {
                eventBus.emit('scrollToMessage', { id: editMessageId });
              }}
            >
              <span className='text-sm text-primary'>{t('edit_message')}</span>
              <p className='line-clamp-1 text-sm'>
                {
                  messages.find((message) => message.id === editMessageId)
                    ?.message
                }
              </p>
            </div>
            <Button
              size='icon'
              variant='ghost'
              className='ml-auto size-8 min-w-8 rounded-full'
              onClick={() => {
                setIsEditing(false);
                setEditMessageId('');
                setInputMessage('');
              }}
            >
              <IoClose size={18} />
            </Button>
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          className='h-[68px] max-h-[200px] w-full rounded-xl bg-card-gradient-menu-on p-2'
          id='chat-message-input'
          onKeyDown={handleInputKeyDown}
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
          {isLoadingSubmit ? (
            <Loader2 color='gray' size={18} className='animate-spin' />
          ) : (
            <IoSendOutline color='gray' size={18} />
          )}
        </Button>
      )}
    </div>
  );
}
