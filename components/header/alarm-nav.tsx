'use client';

import { usePathname, useRouter } from 'next/navigation';
import eventBus from '@/eventBus';
import { TiMessages } from 'react-icons/ti';
import { useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import getSubscribedRooms from '@/lib/server/chat/getSubscribedRooms';
import getUnsubscribedNewRooms from '@/lib/server/chat/getUnsubscribedNewRooms';
import useCentrifuge from '@/hooks/useCentrifuge';
import { PaxContext } from '@/context/context';

export default function AlarmNav({
  authenticated,
}: {
  authenticated: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [roomCount, setRoomCount] = useState(0);
  const { user } = useContext(PaxContext);

  const checkMessagesInPathname = () => {
    if (pathname.includes('chat')) {
      eventBus.emit('startChat', '0');
      eventBus.emit('close');
    } else {
      router.push('/chat?mode=true');
    }
  };

  const onPublication = (publication: any) => {
    if (publication.type === 'new_room') {
      setRoomCount((roomCount) => roomCount + 1);
    } else if (publication.type === 'unsubscribe_room') {
      setRoomCount((roomCount) => roomCount - 1);
    }
  };

  useCentrifuge(onPublication);

  const getRoomCount = async () => {
    try {
      const subscribedRooms = await getSubscribedRooms();
      const unSubscribedRooms = await getUnsubscribedNewRooms();

      return subscribedRooms.length + unSubscribedRooms.length;
    } catch (error) {
      return 0;
    }
  };

  useEffect(() => {
    getRoomCount().then((roomCount) => setRoomCount(roomCount));
  }, []);

  return authenticated || user ? (
    <div>
      <button onClick={checkMessagesInPathname}>
        <div className='flex items-center justify-center'>
          <span className='relative -top-2 left-12 rounded-full bg-card-gradient-menu px-2 text-center text-xs'>
            {roomCount}
          </span>
          <TiMessages size={32} />
        </div>
      </button>
    </div>
  ) : (
    <></>
  );
}
