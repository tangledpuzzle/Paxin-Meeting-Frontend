'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';
import subscribe from './subscribe';

const sendMessage = async ({
  roomId,
  message,
  parentMessageId,
  msgType,
}: {
  roomId: string;
  message: string;
  parentMessageId?: string;
  msgType?: string;
}) => {
  try {
    const accessToken = await getAccessToken();

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/message/${roomId}`,
      method: 'POST',
      data: {
        content: message,
        parentMessageId,
        msgType,
      },
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default sendMessage;
