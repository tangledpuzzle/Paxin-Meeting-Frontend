import React from 'react';
import { Switch } from '@headlessui/react';
import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateAllowPlayAudioNotification } from '@/store/slices/roomSettingsSlice';
import { useTranslations } from 'next-intl';

const allowPlayAudioNotificationSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.allowPlayAudioNotification
);
const Notification = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const allowPlayAudioNotification = useAppSelector(
    allowPlayAudioNotificationSelector
  );

  const toggleAudioNotification = () => {
    dispatch(updateAllowPlayAudioNotification(!allowPlayAudioNotification));
  };

  const render = () => {
    return (
      <Switch.Group>
        <div className='mb-2 flex items-center justify-between'>
          <Switch.Label className='w-full pr-4 dark:text-darkText ltr:text-left rtl:text-right'>
            {t('header.room-settings.allow-audio-notification')}
          </Switch.Label>
          <Switch
            checked={allowPlayAudioNotification}
            onChange={toggleAudioNotification}
            className={`${
              allowPlayAudioNotification
                ? 'bg-primaryColor dark:bg-darkSecondary2'
                : 'bg-gray-200 dark:bg-secondaryColor'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            <span
              className={`${
                allowPlayAudioNotification
                  ? 'ltr:translate-x-6 rtl:-translate-x-6'
                  : 'ltr:translate-x-1 rtl:translate-x-0'
              } inline-block size-4 rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </Switch.Group>
    );
  };

  return <div className='mt-2'>{render()}</div>;
};

export default Notification;
