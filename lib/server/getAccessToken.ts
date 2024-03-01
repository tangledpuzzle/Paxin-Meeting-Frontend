'use server';

import authOptions from '@/lib/authOptions';
import { getServerSession } from 'next-auth';

const getAccessToken = async () => {
  const session = await getServerSession(authOptions);

  return session?.accessToken;
};

export default getAccessToken;
