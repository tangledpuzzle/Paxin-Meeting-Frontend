'use server';

import getAccessToken from '../getAccessToken';
import axios from 'axios';

const getSubscriptionToken = async (channel: string) => {
  try {
    const accessToken = await getAccessToken();
    const res = await axios.get(
      `${process.env.API_URL}/api/contrifugoToken/subscription?channel=${channel}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data.token;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default getSubscriptionToken;
