'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const sendMessage = async ({
  roomId,
  message,
}: {
  roomId: number;
  message: string;
}) => {
  try {
    const accessToken = await getAccessToken();

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/message/${roomId}`,
      method: 'POST',
      data: {
        content: message,
      },
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    console.log(JSON.stringify(res, null, 2));

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default sendMessage;
