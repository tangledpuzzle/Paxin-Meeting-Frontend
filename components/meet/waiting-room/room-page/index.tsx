import React from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';

import { RootState } from '@/store';
import { useAppSelector } from '@/store/hook';
import Logo from './logo';
import { useTranslations } from 'next-intl';

const waitingRoomMessageSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features.waiting_room_features,
  (waiting_room_features) => waiting_room_features?.waiting_room_msg
);

const WaitingRoomPage = () => {
  const t = useTranslations('meet');
  const waitingRoomMessage = useAppSelector(waitingRoomMessageSelector);

  return (
    <>
      <div className='waiting-room-inner relative z-10'>
        <div className='logo relative z-20 m-auto w-full'>
          <Logo />
        </div>
        <div className='divider m-auto my-5 h-[2px] w-full max-w-[50px] bg-primaryColor dark:bg-darkText'></div>
        <div className='loading-wrap relative h-24'>
          <div className='loading absolute left-0 right-0 top-3 z-[999] m-auto text-center'>
            <div className='lds-ripple'>
              <div className='border-secondaryColor' />
              <div className='border-secondaryColor' />
            </div>
          </div>
        </div>
        <p className='m-auto w-full max-w-5xl text-center text-3xl leading-normal dark:text-darkText'>
          {isEmpty(waitingRoomMessage)
            ? t('notifications.waiting-for-approval')
            : waitingRoomMessage}
        </p>
      </div>
    </>
  );
};

export default WaitingRoomPage;
