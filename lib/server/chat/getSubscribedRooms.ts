'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { ChatRoom } from '@/context/chat-context';

const getSubscribedRooms = async () => {
  try {
    const accessToken = await getAccessToken();
    const session = await getServerSession(authOptions);

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/rooms`,
      method: 'GET',
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    if (res.status !== 'success') {
      return [];
    }

    const _rooms: ChatRoom[] = [];

    for (const room of res.data) {
      const _room = {
        id: `${room.ID}`,
        lastMessage: {
          id: room.LastMessage.ID,
          message: room.LastMessage.Content,
          owner: room.LastMessage.UserID,
        },
        user: {
          id: '',
          name: '',
          avatar: '',
          online: false,
        },
        subscribed: true,
        timestamp: room.LastMessage.CreatedAt,
      };

      for (const member of room.Members) {
        if (member.UserID !== session?.user?.id) {
          console.log(member);
          _room.user.id = member.UserID;
          _room.user.name = member.User.Name;
          _room.user.avatar = `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${member.User.Photo}`;
          _room.user.online = member.User.online;
          _room.subscribed = member.IsSubscribed;
        }
      }

      _rooms.push(_room);
    }

    return _rooms;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export default getSubscribedRooms;
