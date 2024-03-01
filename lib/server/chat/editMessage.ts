'use server';

import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';

const editMessage = async ({
  messageId,
  newMessage,
  session,
}: {
  messageId: string;
  newMessage: string;
  session: string;
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
      session,
    });

    console.log(JSON.stringify(res, null, 2));

    return res;
  } catch (error) {
    console.error(error);
  }
};

export default editMessage;
