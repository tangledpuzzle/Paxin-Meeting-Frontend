'use client';

import { ChatMessage, ChatRoom, PaxChatContext } from '@/context/chat-context';
import useCentrifuge from '@/hooks/useCentrifuge';
import getAllMessages from '@/lib/server/chat/getAllMessages';
import getConnectionToken from '@/lib/server/chat/getConnectionToken';
import getSubscribedRooms from '@/lib/server/chat/getSubscribedRooms';
import getSubscriptionToken from '@/lib/server/chat/getSubscriptionToken';
import getUnsubscribedNewRooms from '@/lib/server/chat/getUnsubscribedNewRooms';
import {
  Centrifuge,
  PublicationContext,
  SubscribedContext,
  SubscriptionState,
  SubscriptionStateContext,
} from 'centrifuge';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<string>('');
  const [activeRoomSubscribed, setActiveRoomSubscribed] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isMessageLoading, setIsMessageLoading] = useState(true);
  const [isRoomLoading, setIsRoomLoading] = useState(true);
  const { data: session } = useSession();

  const onPublication = (publication: any) => {
    console.log(publication);
    if (publication.type === 'new_message') {
      setMessages((messages) => {
        const index = messages.findIndex(
          (msg) => msg.id === `${publication.body.id}`
        );

        if (index === -1) {
          return [
            ...messages,
            {
              id: `${publication.body.id}` as string,
              message: publication.body.content as string,
              owner: {
                id: publication.body.user_id as string,
                name: publication.body.user.name,
                avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${publication.body.user.photo}`,
              },
              isDeleted: publication.body.is_deleted as boolean,
              isEdited: publication.body.is_deleted as boolean,
              timestamp: publication.body.created_at as string,
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
            name: sender.user.name,
            avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${sender.user.photo}`,
            online: sender.user.online,
          },
          subscribed: false,
          timestamp: publication.body.created_at,
        });

        return chatRooms;
      });
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
        const index = chatRooms.findIndex(
          (room) => room.id === `${publication.body.id}`
        );

        if (index > -1) {
          chatRooms[index].subscribed = false;
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
        setMessages(res);

        setIsMessageLoading(false);
      })
      .catch(() => {
        setIsMessageLoading(false);
      });
  }, [activeRoom]);

  useEffect(() => {
    console.log('SDF', activeRoom, chatRooms);
    chatRooms.forEach((room) => {
      if (room.id === activeRoom) {
        setActiveRoomSubscribed(room.subscribed);
      }
    });
  }, [chatRooms, activeRoom]);

  // useEffect(() => {
  //   if (!sub.current) return;

  //   sub.current.on('publication', (ctx: PublicationContext) => {
  //     onPublication(ctx.data);
  //   });
  // }, [sub.current]);

  return (
    <PaxChatContext.Provider
      value={{
        chatRooms,
        setChatRooms,
        activeRoom,
        setActiveRoom,
        activeRoomSubscribed,
        setActiveRoomSubscribed,
        messages,
        setMessages,
        isMessageLoading,
        setIsMessageLoading,
        isRoomLoading,
        setIsRoomLoading,
      }}
    >
      {children}
    </PaxChatContext.Provider>
  );
}
