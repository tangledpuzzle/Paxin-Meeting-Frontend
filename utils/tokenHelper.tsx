import apiHelper from '@/helpers/api/apiRequest';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

const getToken = async (slug: string, userId: string, userAvatar: string, userName: string) => {
  try {
    const response = await apiHelper({
      url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + `room/join/${slug}`,
      method: 'POST',
      data: {
        userId,
        photo: userAvatar,
        userName,
      },
    });
    return response.data.token;
  } catch (error) {
    console.error('Error fetching token:', error);
    throw new Error('Unable to fetch token');
  }
};

const getOrCreateToken = async (slug: string, userId: string, userAvatar: string, userName: string, sessionKey: string) => {
  try {
    const sessionToken = localStorage.getItem(sessionKey);
    if (sessionToken) {
      const payload: JwtPayload = jwtDecode(sessionToken);
      if (payload.exp && new Date(payload.exp * 1000) < new Date()) {
        localStorage.removeItem(sessionKey);
        const token = await getToken(slug, userId, userAvatar, userName);
        localStorage.setItem(sessionKey, token);
        return token;
      }
      return sessionToken;
    }
    const token = await getToken(slug, userId, userAvatar, userName);
    localStorage.setItem(sessionKey, token);
    return token;
  } catch (error) {
    console.error('Error managing token:', error);
    throw new Error('Unable to manage token');
  }
};

export { getToken, getOrCreateToken };
