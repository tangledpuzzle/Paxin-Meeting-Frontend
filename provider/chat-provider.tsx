'use client';

import { ChatMessage, ChatRoom, PaxChatContext } from '@/context/chat-context';
import getConnectionToken from '@/lib/server/chat/getConnectionToken';
import { useContext, useEffect, useState } from 'react';
import {
  Centrifuge,
  PublicationContext,
  SubscriptionStateContext,
  SubscribedContext,
  SubscriptionState,
} from 'centrifuge';
import { PaxContext } from '@/context/context';
import getSubscriptionToken from '@/lib/server/chat/getSubscriptionToken';
import getAllMessages from '@/lib/server/chat/getAllMessages';
import getSubscribedRooms from '@/lib/server/chat/getSubscribedRooms';
import getUnsubscribedNewRooms from '@/lib/server/chat/getUnsubscribedNewRooms';

export default function Providers({ children }: { children: React.ReactNode }) {
  const { user } = useContext(PaxContext);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [unrecoverableError, setUnrecoverableError] = useState('');
  const [realTimeStatus, setRealTimeStatus] = useState('🔴');

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

      const _messages = messages;
      _messages[index].message = publication.body.content;
      _messages[index].isEdited = true;

      setMessages(_messages);
    } else if (publication.type === 'delete_message') {
      const index = messages.findIndex(
        (msg) => msg.id === `${publication.body.id}`
      );

      const _messages = messages;
      _messages[index].message = publication.body.content;
      _messages[index].isDeleted = true;

      setMessages(_messages);
    } else if (publication.type === 'new_room') {
      const _chatRooms = chatRooms;
      const sender = publication.body.members.find(
        (member: any) => member.user.id !== user?.id
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
      _chatRooms[index].subscribed = true;

      if (activeRoom && activeRoom.id === `${publication.body.id}`) {
        setActiveRoom(_chatRooms[index]);
      }

      setChatRooms(_chatRooms);
    }
  };

  const getRooms = (data: any, subscribed: boolean) => {
    const _rooms: ChatRoom[] = [];

    for (const room of data) {
      const _room = {
        id: `${room.ID}`,
        lastMessage: '',
        user: {
          id: '',
          name: '',
          avatar: '',
          online: false,
        },
        subscribed: subscribed,
        timestamp: room.LastMessage.CreatedAt,
      };

      _room.lastMessage = room.LastMessage.Content;

      for (const member of room.Members) {
        if (member.UserID !== user?.id) {
          _room.user.id = member.UserID;
          _room.user.name = member.User.Name;
          _room.user.avatar = `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${member.User.Photo}`;
          _room.user.online = member.User.online;
        }
      }

      _rooms.push(_room);
    }

    return _rooms;
  };

  useEffect(() => {
    getConnectionToken().then((token: string) => {
      console.log(token);
    });

    getSubscribedRooms().then((res) => {
      const roomList: ChatRoom[] = getRooms(res.data, true);

      getUnsubscribedNewRooms().then((res) => {
        const _rooms: ChatRoom[] = [...roomList, ...getRooms(res.data, false)];

        _rooms.sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );

        setChatRooms(_rooms);
      });
    });

    console.log(user);
  }, [user]);

  useEffect(() => {
    if (!user?.id) return;
    if (!activeRoom) return;

    getAllMessages({ roomId: activeRoom.id }).then((res) => {
      const _messages: ChatMessage[] = [];

      for (const item of res.data.messages) {
        _messages.push({
          id: `${item.ID}`,
          message: item.Content,
          owner: {
            id: item.UserID,
            name: item.User.Name,
            avatar: `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${item.User.Photo}`,
          },
          timestamp: item.CreatedAt,
          isDeleted: item.IsDeleted,
          isEdited: item.IsEdited,
        });
      }

      _messages.sort((a, b) => {
        return (
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });

      setMessages(_messages);
    });
  }, [activeRoom, user]);

  useEffect(() => {
    if (!user?.id) return;

    const personalChannel = `personal:${user.id}`;

    const getPersonalChannelSubscriptionToken = async () => {
      return getSubscriptionToken(personalChannel);
    };

    const centrifuge = new Centrifuge(
      `wss://${process.env.NEXT_PUBLIC_SOCKET_URL}/connection/websocket` || '',
      {
        getToken: getConnectionToken,
        debug: true,
      }
    );

    console.log('new Centrifuge');

    const sub = centrifuge.newSubscription(personalChannel, {
      getToken: getPersonalChannelSubscriptionToken,
    });

    sub
      .on('publication', (ctx: PublicationContext) => {
        onPublication(ctx.data);
      })
      .on('subscribed', (ctx: SubscribedContext) => {
        if (ctx.wasRecovering && !ctx.recovered) {
          setUnrecoverableError('State LOST - please reload the page');
        }
      });

    sub.on('state', (ctx: SubscriptionStateContext) => {
      if (ctx.newState == SubscriptionState.Subscribed) {
        setRealTimeStatus('🟢');
      } else {
        setRealTimeStatus('🔴');
      }
    });

    sub.subscribe();
    centrifuge.connect();

    return () => {
      console.log('disconnect Centrifuge');
      centrifuge.disconnect();
    };
  }, [user]);

  return (
    <PaxChatContext.Provider
      value={{
        chatRooms,
        setChatRooms,
        activeRoom,
        setActiveRoom,
        messages,
        setMessages,
      }}
    >
      {children}
    </PaxChatContext.Provider>
  );
}
