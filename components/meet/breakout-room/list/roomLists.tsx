import React, { useMemo } from 'react';
import { Disclosure } from '@headlessui/react';

import { useGetBreakoutRoomsQuery } from '@/store/services/breakoutRoomApi';
import EndBtn from './room/endBtn';
import BreakoutRoomUsers from './room/users';
import BreakoutRoomDuration from './room/duration';
import JoinBtn from './room/joinBtn';
import ExtendDuration from './room/extendDuration';
import { BreakoutRoom } from '@/helpers/proto/plugnmeet_breakout_room_pb';
import { useTranslations } from 'next-intl';

const RoomLists = () => {
  const t = useTranslations('meet');
  const { data, isLoading } = useGetBreakoutRoomsQuery(undefined, {
    pollingInterval: 10000,
  });

  const sortedRooms = useMemo(() => {
    if (data && data.rooms) {
      const sortedRooms = data.rooms.slice();
      sortedRooms.sort((a, b) => b.title.localeCompare(a.title));
      return sortedRooms;
    }
  }, [data]);

  const renderDisclosure = (room: BreakoutRoom) => {
    return (
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className='flex w-full items-center justify-between rounded-lg bg-secondaryColor px-4 py-2 text-left text-sm font-medium text-white outline-none transition ease-in hover:bg-primaryColor'>
              <p>{room.title}</p>
              <div className='flex items-center'>
                {room.started ? (
                  <BreakoutRoomDuration
                    duration={room.duration}
                    created={room.created}
                  />
                ) : (
                  t('breakout-room.not-started')
                )}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className={`${
                    open ? 'rotate-180' : ''
                  } ml-6 size-5 text-white`}
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  strokeWidth='2'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M19 9l-7 7-7-7'
                  />
                </svg>
              </div>
            </Disclosure.Button>
            <Disclosure.Panel className='py-6 text-sm text-gray-500 dark:text-darkText sm:px-4'>
              <div className='row mb-4 flex flex-wrap items-center justify-between'>
                <ExtendDuration breakoutRoomId={room.id} />
                <div className='row mb-2 flex'>
                  <JoinBtn breakoutRoomId={room.id} />
                  <EndBtn breakoutRoomId={room.id} />
                </div>
              </div>
              <BreakoutRoomUsers users={room.users} />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    );
  };

  return (
    <div className='breakout-room-list-wrapper relative min-h-[90px]'>
      {isLoading ? (
        <div className='loading absolute inset-x-0 top-1/2 z-[999] m-auto -translate-y-1/2 text-center'>
          <div className='lds-ripple'>
            <div className='border-secondaryColor' />
            <div className='border-secondaryColor' />
          </div>
        </div>
      ) : null}
      {sortedRooms?.map((room) => {
        return (
          <div className='breakout-room-list-item my-1' key={room.id}>
            {renderDisclosure(room)}
          </div>
        );
      })}
    </div>
  );
};

export default RoomLists;
