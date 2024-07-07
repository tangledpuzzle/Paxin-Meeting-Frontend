'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const markAsUnRead = async (roomId: string) => {
  try {
    const accessToken = await getAccessToken();

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/unread/${roomId}/true`,
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
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
};

export default markAsUnRead;
