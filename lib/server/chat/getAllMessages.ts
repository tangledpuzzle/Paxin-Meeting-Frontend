'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const getAllMessages = async (roomId: string) => {
  try {
    const accessToken = await getAccessToken();
    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/message/${roomId}`,
      method: 'GET',
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    if (res.status !== 'success') {
      return [];
    }

    const _messages = [];

    for (const item of res.data.messages) {
      _messages.push({
        id: `${item.ID}`,
        parentMessageId: item.ParentMessageID ? `${item.ParentMessageID}`: undefined,
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

    _messages.sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return _messages;
  } catch (error) {
    console.error(error);

    return [];
  }
};

export default getAllMessages;
