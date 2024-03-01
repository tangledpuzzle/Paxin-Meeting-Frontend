'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const getUnsubscribedNewRooms = async () => {
  try {
    const accessToken = await getAccessToken();

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/newRooms`,
      method: 'GET',
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    console.log(JSON.stringify(res, null, 2));

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default getUnsubscribedNewRooms;
