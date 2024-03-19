'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const subscribe = async (roomId: string) => {
  try {
    const accessToken = await getAccessToken();

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/subscribe/${roomId}`,
      method: 'PATCH',
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default subscribe;
