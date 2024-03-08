'use server';

import getSubscribedRooms from './getSubscribedRooms';
import getUnsubscribedNewRooms from './getUnsubscribedNewRooms';

const getRoomId = async (userId: string) => {
  try {
    if (!userId) {
      return '';
    }

    const subscribedRooms = await getSubscribedRooms();
    const unSubscribedRooms = await getUnsubscribedNewRooms();

    for (const room of [...subscribedRooms, ...unSubscribedRooms]) {
      if (room.user.id === userId) {
        return room.id;
      }
    }

    return '';
  } catch (error) {
    console.log(error);

    return '';
  }
};

export default getRoomId;
