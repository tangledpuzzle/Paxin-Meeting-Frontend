'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const editMessage = async ({
  messageId,
  newMessage,
}: {
  messageId: string;
  newMessage: string;
}) => {
  try {
    const accessToken = await getAccessToken();
    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/message/${messageId}`,
      method: 'PATCH',
      data: {
        content: newMessage,
      },
      token: accessToken || '',
      session: cookies().get('session')?.value || '',
    });

    console.log(JSON.stringify(res, null, 2), 'EDIT_MESSAGER');

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default editMessage;
