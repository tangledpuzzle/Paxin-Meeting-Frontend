'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import { ChatRoomType } from '@/context/chat-context';
import { headers } from 'next/headers';
import cookie from 'cookie'; 

const getUnsubscribedNewRooms = async () => {
  const locale = cookies().get('NEXT_LOCALE')?.value || 'en';

  try {
    const accessToken = await getAccessToken();
    const session = await getServerSession(authOptions);

    const headersList = headers();
    const cookiesHeader = headersList.get('cookie');
    const cookiesParsed = cookiesHeader ? cookie.parse(cookiesHeader) : {};
    const userIdCookie = cookiesParsed['UserID'];

    const userId = session?.user?.id || userIdCookie || null;

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/newRooms`,
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
          lastSeenMessage: '',
          online: false,
          lastOnlineTimestamp: '',
          bot: false,
        },
        subscribed: false,
        unreadCount: 1,
        lastSeenMessage: '',
        timestamp: room.LastMessage.CreatedAt,
      };

      for (const member of room.Members) {
        if (member.UserID === userId) {
          _room.lastSeenMessage = member.LastReadMessageID || '';
        } else if (member.UserID !== userId) {
          _room.user.id = member.UserID;
          _room.user.profile.name = member.User.Name;
          _room.user.profile.avatar = `https://proxy.myru.online/150/https://img.myru.online/${member.User.Photo}`;
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
          _room.user.lastSeenMessage = member.LastReadMessageID || '';
          _room.user.lastOnlineTimestamp = member.User.last_online || '';
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

export default getUnsubscribedNewRooms;
