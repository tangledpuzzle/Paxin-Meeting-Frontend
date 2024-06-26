import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/authOptions';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  let accessToken = session?.accessToken;
  if (!accessToken) {
    const cookies = req.headers.cookie || '';
    const parsedCookies = cookie.parse(cookies);
    accessToken = parsedCookies.access_token;
  }

  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { Title, Text, PageURL } = req.body;

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/relations/send-push`,
      { Title, Text, PageURL },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to send push notification' });
  }
}
