'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const deleteMessage = async ({ messageId }: { messageId: string }) => {
  try {
    const accessToken = await getAccessToken();

    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/message/${messageId}`,
      method: 'DELETE',
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    console.log(JSON.stringify(res, null, 2), 'DELETE MESSAGE');

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default deleteMessage;
