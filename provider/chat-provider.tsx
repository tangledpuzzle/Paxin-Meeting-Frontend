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
import { useEffect, useState } from 'react';

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
      const index = messages.findIndex(
        (msg) => msg.id === `${publication.body.id}`
      );

      index === -1 &&
        setMessages((messages) => [
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
        ]);
    } else if (publication.type === 'edit_message') {
      const index = messages.findIndex(
        (msg) => msg.id === `${publication.body.id}`
      );

      if (index > -1) {
        const _messages = messages;
        _messages[index].message = publication.body.content;
        _messages[index].isEdited = true;

        setMessages(_messages);
      }
    } else if (publication.type === 'delete_message') {
      const index = messages.findIndex(
        (msg) => msg.id === `${publication.body.id}`
      );

      if (index > -1) {
        const _messages = messages;
        _messages[index].message = publication.body.content;
        _messages[index].isDeleted = true;

        setMessages(_messages);
      }
    } else if (publication.type === 'new_room') {
      const _chatRooms = chatRooms;
      const sender = publication.body.members.find(
        (member: any) => member.user.id !== session?.user?.id
      );
      _chatRooms.push({
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
    } else if (publication.type === 'subscribe_room') {
      const _chatRooms = chatRooms;
      const index = _chatRooms.findIndex(
        (room) => room.id === `${publication.body.id}`
      );

      if (index > -1) {
        _chatRooms[index].subscribed = true;

        setChatRooms(_chatRooms);
      }
    }
  };

  const { centrifuge } = useCentrifuge(onPublication);

  // const getRooms = (data: any, subscribed: boolean) => {
  //   const _rooms: ChatRoom[] = [];

  //   for (const room of data) {
  //     const _room = {
  //       id: `${room.ID}`,
  //       lastMessage: '',
  //       user: {
  //         id: '',
  //         name: '',
  //         avatar: '',
  //         online: false,
  //       },
  //       subscribed: subscribed,
  //       timestamp: room.LastMessage.CreatedAt,
  //     };

  //     _room.lastMessage = room.LastMessage.Content;

  //     for (const member of room.Members) {
  //       if (member.UserID !== session?.user?.id) {
  //         _room.user.id = member.UserID;
  //         _room.user.name = member.User.Name;
  //         _room.user.avatar = `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${member.User.Photo}`;
  //         _room.user.online = member.User.online;
  //       }
  //     }

  //     _rooms.push(_room);
  //   }

  //   return _rooms;
  // };

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
    chatRooms.forEach((room) => {
      if (room.id === activeRoom) {
        setActiveRoomSubscribed(room.subscribed);
      }
    });
  }, [chatRooms, activeRoom]);

  // useEffect(() => {
  //   if (!session?.user?.id) return;

  //   const personalChannel = `personal:${session.user.id}`;

  //   const getPersonalChannelSubscriptionToken = async () => {
  //     return getSubscriptionToken(personalChannel);
  //   };

  //   const centrifuge = new Centrifuge(
  //     `wss://${process.env.NEXT_PUBLIC_SOCKET_URL}/connection/websocket` || '',
  //     {
  //       getToken: getConnectionToken,
  //       debug: true,
  //     }
  //   );

  //   console.log('new Centrifuge');

  //   const sub = centrifuge.newSubscription(personalChannel, {
  //     getToken: getPersonalChannelSubscriptionToken,
  //   });

  //   sub
  //     .on('publication', (ctx: PublicationContext) => {
  //       onPublication(ctx.data);
  //     })
  //     .on('subscribed', (ctx: SubscribedContext) => {
  //       if (ctx.wasRecovering && !ctx.recovered) {
  //         setUnrecoverableError('State LOST - please reload the page');
  //       }
  //     });

  //   sub.on('state', (ctx: SubscriptionStateContext) => {
  //     if (ctx.newState == SubscriptionState.Subscribed) {
  //       setRealTimeStatus('🟢');
  //     } else {
  //       setRealTimeStatus('🔴');
  //     }
  //   });

  //   sub.subscribe();
  //   centrifuge.connect();

  //   return () => {
  //     console.log('disconnect Centrifuge');
  //     centrifuge.disconnect();
  //   };
  // }, [session]);

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
