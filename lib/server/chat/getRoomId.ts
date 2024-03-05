'use server';

import getSubscribedRooms from './getSubscribedRooms';

const getRoomId = async (userId: string) => {
  try {
    if (!userId) {
      return '';
    }

    const data = await getSubscribedRooms();

    if (!data) {
      return '';
    }

    for (const room of data.data) {
      for (const member of room.Members) {
        if (member.UserID === userId) {
          return `${room.ID}`;
        }
      }
    }

    return '';
  } catch (error) {
    console.log(error);

    return '';
  }
};

export default getRoomId;
