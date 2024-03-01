'use server';

import getSubscribedRooms from './getSubscribedRooms';

const getRoomId = async (userId: string) => {
  try {
    if (!userId) {
      return -1;
    }

    const data = await getSubscribedRooms();

    if (!data) {
      return -1;
    }

    for (const room of data.data) {
      for (const member of room.Members) {
        if (member.UserID === userId) {
          return room.ID;
        }
      }
    }

    return -1;
  } catch (error) {
    console.log(error);

    return -1;
  }
};

export default getRoomId;
