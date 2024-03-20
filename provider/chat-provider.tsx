'use client';

import {
  ChatMessageType,
  ChatRoomType,
  ChatUserType,
  PaxChatContext,
} from '@/context/chat-context';
import useCentrifuge from '@/hooks/useCentrifuge';
import getAllMessages from '@/lib/server/chat/getAllMessages';
import getSubscribedRooms from '@/lib/server/chat/getSubscribedRooms';
import getUnsubscribedNewRooms from '@/lib/server/chat/getUnsubscribedNewRooms';
import { Howl, Howler } from 'howler';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

Howler.autoUnlock = true;

export default function Providers({ children }: { children: React.ReactNode }) {
  const t = useTranslations('chatting');
  const router = useRouter();
  const locale = useLocale();
  const [showNav, setShowNav] = useState(true);
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>('');
  const [chatUser, setChatUser] = useState<ChatUserType | null>(null);
  const [activeRoomSubscribed, setActiveRoomSubscribed] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [deleteMessageId, setDeleteMessageId] = useState('');
  const [editMessageId, setEditMessageId] = useState('');
  const [replyMessageId, setReplyMessageId] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [chatWindowHeight, setChatWindowHeight] = useState(
    '100vh - 5rem - 20px - 68px - 4rem'
  );
  const { data: session } = useSession();

  const messageReceivedSound = new Howl({
    src: ['/audio/message-received.mp3'],
    html5: true,
    loop: false,
    preload: true,
  });

  const onPublication = (publication: any) => {
    console.log(publication);
    if (publication.type === 'new_message') {
      if (`${publication.body.room_id}` === activeRoom)
        setMessages((messages) => {
          const index = messages.findIndex(
            (msg) => msg.id === `${publication.body.id}` || msg.id === '00000'
          );

          if (index === -1) {
            return [
              ...messages,
              {
                id: `${publication.body.id}`,
                parentMessageId: publication.body.parent_msg_id
                  ? publication.body.parent_msg_id
                  : undefined,
                messageType: `${publication.body.msgType}` as '0' | '1' | '2',
                message: publication.body.content,
                customData:
                  publication.body.msgType > 0
                    ? JSON.parse(publication.body.jsonData)
                    : undefined,
                owner: {
                  id: publication.body.user_id,
                  name: publication.body.user.name,
                  avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${publication.body.user.photo}`,
                },
                isDeleted: publication.body.is_deleted,
                isEdited: publication.body.is_deleted,
                timestamp: publication.body.created_at,
              },
            ];
          } else {
            return messages;
          }
        });

      setChatRooms((chatRooms) => {
        chatRooms.forEach((room) => {
          if (room.id === `${publication.body.room_id}`) {
            room.lastMessage = {
              id: `${publication.body.id}`,
              message: publication.body.content,
              owner: publication.body.user_id,
            };
            room.timestamp = publication.body.created_at;
          }
        });

        chatRooms.sort((a, b) => {
          return (
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
        });

        return chatRooms;
      });

      messageReceivedSound.play();
    } else if (publication.type === 'edit_message') {
      setMessages((messages) => {
        const index = messages.findIndex(
          (msg) => msg.id === `${publication.body.id}`
        );

        if (index > -1) {
          messages[index].message = publication.body.content;
          messages[index].isEdited = true;
        }

        return messages;
      });

      setChatRooms((chatRooms) => {
        chatRooms.forEach((room) => {
          if (room.lastMessage.id === `${publication.body.id}`) {
            room.lastMessage.message = publication.body.content;
          }
        });

        return chatRooms;
      });
    } else if (publication.type === 'delete_message') {
      setMessages((messages) => {
        const index = messages.findIndex(
          (msg) => msg.id === `${publication.body.id}`
        );

        if (index > -1) {
          messages[index].message = publication.body.content;
          messages[index].isDeleted = true;
        }

        return messages;
      });

      // setChatRooms((chatRooms) => {
      //   chatRooms.forEach((room) => {
      //     if (room.lastMessage.id === `${publication.body.id}`) {
      //       room.lastMessage.message = publication.body.content;
      //     }
      //   });

      //   return chatRooms;
      // });
    } else if (publication.type === 'new_room') {
      setChatRooms((chatRooms) => {
        const sender = publication.body.members.find(
          (member: any) => member.user.id !== session?.user?.id
        );
        chatRooms.push({
          id: `${publication.body.id}`,
          lastMessage: publication.body.last_message.content,
          user: {
            id: sender.user.id,
            profile: {
              name: sender.user.name,
              avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${sender.user.photo}`,
              categories: sender.user.profile[0].guild.map(
                (guild: any) => guild.translations[0].name
              ),
              bio: sender.user.profile[0].multilang_descr[
                locale.charAt(0).toUpperCase() + locale.slice(1)
              ],
            },
            lastSeenMessage: '',
            online: sender.user.online,
            bot: sender.user.is_bot,
          },
          unreadCount: 0,
          lastSeenMessage: '',
          subscribed: false,
          timestamp: publication.body.created_at,
        });

        return chatRooms;
      });

      messageReceivedSound.play();
    } else if (publication.type === 'subscribe_room') {
      setChatRooms((chatRooms) => {
        const index = chatRooms.findIndex(
          (room) => room.id === `${publication.body.id}`
        );

        if (index > -1) {
          chatRooms[index].subscribed = true;
        }

        return chatRooms;
      });
    } else if (publication.type === 'unsubscribe_room') {
      setChatRooms((chatRooms) => {
        const newChatRooms = chatRooms.filter(
          (room) => room.id !== `${publication.body.id}`
        );

        return newChatRooms;
      });
    } else if (publication.type === 'updated_last_read_msg_id') {
      // publication.body.lastReadMessageId
      // publication.body.roomId
      // publication.body.ownerId
      setChatRooms((chatRooms) => {
        const index = chatRooms.findIndex(
          (room) => room.id === `${publication.body.roomId}`
        );

        if (index > -1) {
          if (chatRooms[index].user.id === `${publication.body.readerId}`) {
            chatRooms[index].user.lastSeenMessage =
              `${publication.body.lastReadMessageId}`;
          } else {
            chatRooms[index].lastSeenMessage =
              `${publication.body.lastReadMessageId}`;
          }
        }

        return chatRooms;
      });
    }
  };

  useCentrifuge(onPublication);

  const getRooms = async () => {
    try {
      const subscribedRooms = await getSubscribedRooms();
      const unSubscribedRooms = await getUnsubscribedNewRooms();

      const _rooms = [...subscribedRooms, ...unSubscribedRooms];

      _rooms.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      return _rooms;
    } catch (error) {
      console.log(error);

      return [];
    }
  };

  useEffect(() => {
    setIsRoomLoading(true);

    getRooms()
      .then((res) => {
        setChatRooms(res);
        setIsRoomLoading(false);
      })
      .catch(() => {
        setIsRoomLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!activeRoom) return;

    setIsMessageLoading(true);

    getAllMessages(activeRoom)
      .then((res) => {
        console.log(res);
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
        } else setMessages(res.messages);

        setIsMessageLoading(false);
      })
      .catch(() => {
        setIsMessageLoading(false);
      });
  }, [activeRoom]);

  useEffect(() => {
    if (!chatUser) return;

    if (chatUser.bot) {
      setMessages([
        {
          id: new Date().getTime().toString(),
          message: t('bot_default_msg', {
            bot_name: `@${chatUser?.profile.name}`,
          }),
          timestamp: new Date().toLocaleString(),
          owner: {
            id: chatUser?.id || '',
            name: chatUser?.profile.name || '',
            avatar: chatUser?.profile.avatar || '',
          },
        },
      ]);

      setIsMessageLoading(false);
    }
  }, [chatUser]);

  useEffect(() => {
    chatRooms.forEach((room) => {
      if (room.id === activeRoom) {
        setActiveRoomSubscribed(room.subscribed);
      }
    });

    const _chatUser =
      chatRooms.find((room) => room.id === activeRoom)?.user || null;
    setChatUser(_chatUser);
  }, [chatRooms, activeRoom]);

  useEffect(() => {
    if (window === undefined) return;

    const handleVisibilityChange = () => {
      setIsOnline(!window.document.hidden);
    };

    const handleFocus = () => {
      setIsOnline(true);
    };

    const handleBlur = () => {
      setIsOnline(false);
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []); // Empty array ensures this effect runs only on mount and unmount

  // useEffect(() => {
  //   if (!sub.current) return;

  //   sub.current.on('publication', (ctx: PublicationContext) => {
  //     onPublication(ctx.data);
  //   });
  // }, [sub.current]);

  return (
    <PaxChatContext.Provider
      value={{
        showNav,
        setShowNav,
        chatRooms,
        setChatRooms,
        activeRoom,
        setActiveRoom,
        chatUser,
        setChatUser,
        activeRoomSubscribed,
        setActiveRoomSubscribed,
        messages,
        setMessages,
        isMessageLoading,
        setIsMessageLoading,
        isRoomLoading,
        setIsRoomLoading,
        isOnline,
        setIsOnline,
        inputMessage,
        setInputMessage,
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
        chatWindowHeight,
        setChatWindowHeight,
      }}
    >
      {children}
    </PaxChatContext.Provider>
  );
}
