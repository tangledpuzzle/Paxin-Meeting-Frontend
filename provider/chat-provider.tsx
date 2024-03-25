'use client';

import {
  ChatMessageType,
  ChatRoomType,
  ChatUserType,
  PaxChatContext,
} from '@/context/chat-context';
import useCentrifuge from '@/hooks/useCentrifuge';
import getSubscribedRooms from '@/lib/server/chat/getSubscribedRooms';
import getUnsubscribedNewRooms from '@/lib/server/chat/getUnsubscribedNewRooms';
import { Howl, Howler } from 'howler';
import { useSession } from 'next-auth/react';
import { useLocale, useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';

Howler.autoUnlock = true;

export default function Providers({ children }: { children: React.ReactNode }) {
  const t = useTranslations('chatting');
  const locale = useLocale();
  const [showNav, setShowNav] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>('');
  const [chatUser, setChatUser] = useState<ChatUserType | null>(null);
  const [activeRoomSubscribed, setActiveRoomSubscribed] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
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
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const { data: session } = useSession();
  const onPublication = useRef<any>(null);

  const messageReceivedSound = new Howl({
    src: ['/audio/message-received.mp3'],
    html5: true,
    loop: false,
    preload: true,
  });

  useCentrifuge(onPublication.current);

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
        console.log(res);
        setChatRooms(res);
        setIsRoomLoading(false);
      })
      .catch(() => {
        setIsRoomLoading(false);
      });
  }, []);

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
      console.log('online');
    };

    const handleBlur = () => {
      setIsOnline(false);
      console.log('offline');
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('online', handleFocus);
    window.addEventListener('offline', handleBlur);

    // Remove event listeners on cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('online', handleFocus);
      window.removeEventListener('offline', handleBlur);
    };
  }, []); // Empty array ensures this effect runs only on mount and unmount

  useEffect(() => {
    onPublication.current = (publication: any) => {
      console.log(publication, activeRoom);
      if (publication.type === 'new_message') {
        console.log(`${publication.body.room_id}`, activeRoom);
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
                  parentMessage: publication.body.parent_msg_id && publication.body.parentMsg ? {
                    id: `${publication.body.parent_msg_id}`,
                    message: publication.body.parentMsg.content,
                    owner: {
                      id: publication.body.parentMsg.user.id,
                      name: publication.body.parentMsg.user.name,
                      avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${publication.body.parentMsg.user.photo}`,
                    },
                  } : undefined,
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
          return chatRooms
            .map((room) => {
              if (room.id === `${publication.body.room_id}`) {
                return {
                  ...room, // Spread existing room properties
                  lastMessage: {
                    id: `${publication.body.id}`,
                    message: publication.body.content,
                    owner: publication.body.user_id,
                  },
                  timestamp: publication.body.created_at,
                  unreadCount:
                    session?.user?.id !== publication.body.user_id
                      ? room.unreadCount + 1
                      : room.unreadCount,
                };
              }
              return room;
            })
            .sort(
              (a, b) =>
                new Date(b.timestamp).getTime() -
                new Date(a.timestamp).getTime()
            );
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
          return chatRooms.map((room) => {
            // Check if this is the room to update.
            if (room.id === `${publication.body.roomId}`) {
              // Check if the user in this room matches the readerId.
              if (
                room.user &&
                room.user.id === `${publication.body.readerId}`
              ) {
                return {
                  ...room,
                  user: {
                    ...room.user,
                    lastSeenMessage: `${publication.body.lastReadMessageId}`,
                  },
                };
              } else {
                // If not updating a specific user, update the lastSeenMessage for the room.
                let unreadCount = 0;
                messages.forEach((message) => {
                  if (
                    Number(message.id) >
                    Math.max(
                      Number(`${publication.body.lastReadMessageId}`),
                      Number(room.lastSeenMessage || 0)
                    )
                  ) {
                    unreadCount++;
                  }
                });

                return {
                  ...room,
                  lastSeenMessage: `${publication.body.lastReadMessageId}`,
                  unreadCount,
                };
              }
            }

            // For rooms that do not match the condition, return them unchanged.
            return room;
          });
        });
      }
    };
  }, [activeRoom, messages]);

  return (
    <PaxChatContext.Provider
      value={{
        showNav,
        setShowNav,
        showSidebar,
        setShowSidebar,
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
        prevScrollHeight,
        setPrevScrollHeight,
      }}
    >
      {children}
    </PaxChatContext.Provider>
  );
}
