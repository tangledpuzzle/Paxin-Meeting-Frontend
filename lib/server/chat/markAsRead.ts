'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const markAsRead = async (roomId: string, messageId?: string) => {
  try {
    const accessToken = await getAccessToken();

    if (messageId) {
      const res = await requestHelper({
        url: `${process.env.API_URL}/api/chat/read/${roomId}`,
        method: 'PATCH',
        data: {
          messageId: messageId,
        },
        token: accessToken || '',
        session: cookies().get('session')?.value || '',
      });

      if (res.status === 'success') {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
        };
      }
    } else {
      const res = await requestHelper({
        url: `${process.env.API_URL}/api/chat/unread/${roomId}/false`,
        method: 'PATCH',
        token: accessToken || '',
        session: cookies().get('session')?.value || '',
      });

      if (res.status === 'success') {
        return {
          success: true,
        };
      } else {
        return {
          success: false,
        };
      }
    }
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
};

export default markAsRead;
