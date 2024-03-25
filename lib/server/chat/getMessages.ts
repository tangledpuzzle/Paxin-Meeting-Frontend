'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const limit = 20;

const getMessages = async (
  roomId: string,
  skip: number = 1,
  end_msg_id?: string
) => {
  try {
    const accessToken = await getAccessToken();
    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/message/${roomId}?skip=${skip}&limit=${limit}${end_msg_id ? `&end_msg_id=${end_msg_id}` : ''}`,
      method: 'GET',
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    if (res.status !== 'success') {
      return {
        success: false,
        messages: [],
        total: 0,
        limit,
        skip,
        end_msg_id,
      };
    }

    const _messages = [];

    for (const item of res.data.messages) {
      _messages.push({
        id: `${item.ID}`,
        parentMessageId: item.ParentMessageID
          ? `${item.ParentMessageID}`
          : undefined,
        parentMessage: item.ParentMessageID && item.ParentMessage ? {
          id: `${item.ParentMessage.ID}`,
          owner: {
            id: item.ParentMessage.UserID,
          },
          message: item.ParentMessage.Content,
        } : undefined,
        messageType: `${item.MsgType}` as '0' | '1' | '2',
        message:
          process.env.NODE_ENV === 'development'
            ? item.ID + ' - ' + item.Content
            : item.Content,
        customData: item.MsgType > 0 ? JSON.parse(item.JsonData) : undefined,
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

    return {
      success: true,
      messages: _messages,
      total: res.totalCount,
      limit,
      skip,
      end_msg_id,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      messages: [],
      total: 0,
      limit,
      skip,
      end_msg_id,
    };
  }
};

export default getMessages;
