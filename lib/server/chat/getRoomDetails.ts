'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const getRoomDetails = async ({ roomId }: { roomId: string }) => {
  try {
    const accessToken = await getAccessToken();
    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/room/${roomId}`,
      method: 'GET',
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default getRoomDetails;
