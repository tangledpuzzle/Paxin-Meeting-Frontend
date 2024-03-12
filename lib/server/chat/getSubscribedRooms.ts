'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { ChatRoomType } from '@/context/chat-context';

const getSubscribedRooms = async () => {
  const locale = cookies().get('NEXT_LOCALE')?.value || 'en';

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

    const _rooms: ChatRoomType[] = [];

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
          profile: {
            name: '',
            avatar: '',
            categories: [],
            bio: '',
          },
          online: false,
          bot: false,
        },
        subscribed: true,
        timestamp: room.LastMessage.CreatedAt,
      };

      for (const member of room.Members) {
        if (member.UserID !== session?.user?.id) {
          _room.user.id = member.UserID;
          _room.user.profile.name = member.User.Name;
          _room.user.profile.avatar = `https://proxy.paxintrade.com/150/https://img.paxintrade.com/${member.User.Photo}`;
          _room.user.profile.categories =
            member.User.Profile &&
            member.User.Profile.length > 0 &&
            member.User.Profile[0].Guilds.map(
              (guild: any) =>
                guild.Translations?.find((t: any) => t.Language === locale)
                  ?.Name
            );
          _room.user.profile.bio =
            member.User.Profile &&
            member.User.Profile.length > 0 &&
            member.User.Profile[0].MultilangDescr[
              locale.charAt(0).toUpperCase() + locale.slice(1)
            ];
          _room.user.online = member.User.online;
          _room.user.bot = member.User.IsBot;
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
