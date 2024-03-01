'use server';

import { getServerSession } from 'next-auth';
import requestHelper from './requestHelper';
import authOptions from '@/lib/authOptions';
import getAccessToken from '../getAccessToken';

const createRoom = async ({
  acceptorId,
  initialMessage,
  session,
}: {
  acceptorId: string;
  initialMessage: string;
  session: string;
}) => {
  const accessToken = await getAccessToken();

  try {
    const res = await requestHelper({
      url: `${process.env.API_URL}/api/chat/createRoom`,
      method: 'POST',
      data: {
        acceptorId: acceptorId,
        initialMessage,
      },
      token: accessToken || '',
      session,
    });

    if (res.status !== 'success') {
      throw new Error(res.message);
    }

    if (!res.data.room.ID) {
      throw new Error('Room ID not found');
    }

    console.log('Room created successfully', res.data.room.ID);

    return res.data.room.ID;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default createRoom;
