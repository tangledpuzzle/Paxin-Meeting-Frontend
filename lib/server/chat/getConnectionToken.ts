'use server';

import { cookies } from 'next/headers';
import getAccessToken from '../getAccessToken';
import requestHelper from './requestHelper';
import axios from 'axios';

const getConnectionToken = async () => {
  try {
    const accessToken = await getAccessToken();
    const res = await axios.get(
      `${process.env.API_URL}/api/contrifugoToken/connection`,
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

export default getConnectionToken;
