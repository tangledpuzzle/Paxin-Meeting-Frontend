import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import { createSelector } from '@reduxjs/toolkit';
import { VideoQuality } from 'livekit-client';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import {
  updateActivateWebcamsView,
  updateActiveScreenSharingView,
  updateRoomVideoQuality,
} from '@/store/slices/roomSettingsSlice';
import { useTranslations } from 'next-intl';

const activateWebcamsViewSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.activateWebcamsView
);

const activeScreenSharingViewSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.activeScreenSharingView
);

const DataSavings = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>(
    store.getState().roomSettings.roomVideoQuality
  );

  useEffect(() => {
    dispatch(updateRoomVideoQuality(videoQuality));
  }, [dispatch, videoQuality]);

  const activateWebcamsView = useAppSelector(activateWebcamsViewSelector);
  const activeScreenSharingView = useAppSelector(
    activeScreenSharingViewSelector
  );

  const toggleWebcamView = () => {
    dispatch(updateActivateWebcamsView(!activateWebcamsView));
  };

  const toggleScreenShareView = () => {
    dispatch(updateActiveScreenSharingView(!activeScreenSharingView));
  };

  const render = () => {
    return (
      <>
        <div className='mb-2 flex items-center justify-between'>
          <label
            htmlFor='quality'
            className='w-full pr-4 dark:text-darkText ltr:text-left rtl:text-right'
          >
            {t('header.room-settings.video-quality')}
          </label>
          <select
            id='quality'
            name='quality'
            className='mt-1 block rounded-md border border-gray-300 bg-transparent px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 dark:border-darkText dark:text-darkText sm:text-sm'
            value={videoQuality}
            onChange={(e) => setVideoQuality(Number(e.target.value))}
          >
            <option value={VideoQuality.LOW}>
              {t('header.room-settings.low')}
            </option>
            <option value={VideoQuality.MEDIUM}>
              {t('header.room-settings.medium')}
            </option>
            <option value={VideoQuality.HIGH}>
              {t('header.room-settings.high')}
            </option>
          </select>
        </div>

        <Switch.Group>
          <div className='mb-2 flex items-center justify-between'>
            <Switch.Label className='w-full pr-4 dark:text-darkText ltr:text-left rtl:text-right'>
              {t('header.room-settings.show-webcams')}
            </Switch.Label>
            <Switch
              checked={activateWebcamsView}
              onChange={toggleWebcamView}
              className={`${
                activateWebcamsView
                  ? 'bg-primaryColor dark:bg-darkSecondary2'
                  : 'bg-gray-200 dark:bg-secondaryColor'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              <span
                className={`${
                  activateWebcamsView
                    ? 'ltr:translate-x-6 rtl:-translate-x-6'
                    : 'ltr:translate-x-1 rtl:translate-x-0'
                } inline-block size-4 rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
          <div className='flex items-center justify-between'>
            <Switch.Label className='w-full pr-4 dark:text-darkText ltr:text-left rtl:text-right'>
              {t('header.room-settings.show-screen-share')}
            </Switch.Label>
            <Switch
              checked={activeScreenSharingView}
              onChange={toggleScreenShareView}
              className={`${
                activeScreenSharingView
                  ? 'bg-primaryColor dark:bg-darkSecondary2'
                  : 'bg-gray-200 dark:bg-secondaryColor'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              <span
                className={`${
                  activeScreenSharingView
                    ? 'ltr:translate-x-6 rtl:-translate-x-6'
                    : 'ltr:translate-x-1 rtl:translate-x-0'
                } inline-block size-4 rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </Switch.Group>
      </>
    );
  };

  return <div className='mt-2'>{render()}</div>;
};

export default DataSavings;
