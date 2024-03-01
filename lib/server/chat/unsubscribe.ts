'use server';

import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const unsubscribe = async ({
  roomId,
  session,
}: {
  roomId: string;
  session: string;
}) => {
  try {
    const accessToken = await getAccessToken();

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/unsubscribe/${roomId}`,
      method: 'PATCH',
      token: accessToken || '',
      session,
    });

    console.log(JSON.stringify(res, null, 2));

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default unsubscribe;
