'use server';

import getAccessToken from './getAccessToken';

export default async function changeName(name: string) {
  if (!name) {
    return {
      success: false,
      message: 'empty_name',
    };
  }

  const token = await getAccessToken();

  if (!token) {
    return {
      success: false,
      message: 'unauthorized',
    };
  }

  try {
    const res = await fetch(
      `${process.env.API_URL}/api/users/changeName?new_name=${name}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      return {
        success: true,
      };
    } else {
      console.log(res.statusText);
      return {
        success: false,
        message: 'failed_change_name',
      };
    }
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: 'failed_change_name',
    };
  }
}
