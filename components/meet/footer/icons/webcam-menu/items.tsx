import React, { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { createSelector } from '@reduxjs/toolkit';
import { Room, Track } from 'livekit-client';

import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateSelectedVideoDevice } from '@/store/slices/roomSettingsSlice';
import {
  updateIsActiveWebcam,
  updateVirtualBackground,
} from '@/store/slices/bottomIconsActivitySlice';
import { useTranslations } from 'next-intl';

interface IWebcamMenuItemsProps {
  currentRoom: Room;
}
const videoDevicesSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.videoDevices
);

const selectedVideoDeviceSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.selectedVideoDevice
);

const WebcamMenuItems = ({ currentRoom }: IWebcamMenuItemsProps) => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const videoDevices = useAppSelector(videoDevicesSelector);
  const selectedVideoDevice = useAppSelector(selectedVideoDeviceSelector);

  const [devicesMenu, setDevicesMenu] = useState<Array<JSX.Element>>();
  const [newDevice, setNewDevice] = useState<string>();

  useEffect(() => {
    const devicesMenu = videoDevices.map((device) => {
      return (
        <div className='' role='none' key={device.id}>
          <Menu.Item>
            {() => (
              <p
                className={`${
                  selectedVideoDevice === device.id
                    ? 'secondaryColor'
                    : 'text-gray-700 dark:text-darkText'
                } group flex cursor-pointer items-center rounded px-3 py-[0.4rem] text-[10px] transition ease-in hover:bg-primaryColor hover:text-white lg:text-xs`}
                onClick={() => setNewDevice(device.id)}
              >
                {device.label}
              </p>
            )}
          </Menu.Item>
        </div>
      );
    });
    setDevicesMenu(devicesMenu);
  }, [selectedVideoDevice, videoDevices]);

  useEffect(() => {
    if (newDevice) {
      dispatch(updateSelectedVideoDevice(newDevice));
    }
  }, [newDevice, dispatch]);

  const leaveWebcam = () => {
    currentRoom.localParticipant.videoTrackPublications.forEach(async (publication) => {
      if (
        publication.track &&
        publication.track.source === Track.Source.Camera
      ) {
        currentRoom.localParticipant.unpublishTrack(publication.track, true);
      }
    });
    dispatch(updateIsActiveWebcam(false));
    dispatch(updateSelectedVideoDevice(''));
    dispatch(
      updateVirtualBackground({
        type: 'none',
      })
    );
  };

  return (
    <Menu.Items
      static
      className='absolute bottom-[40px] z-[9999] mt-2 w-40 origin-bottom-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-secondaryColor dark:bg-darkPrimary dark:ring-secondaryColor ltr:left-0 rtl:-left-4'
    >
      {devicesMenu}
      <div className='' role='none'>
        <Menu.Item>
          {() => (
            <p
              className='group flex w-full cursor-pointer items-center rounded-md px-2 py-[0.4rem] text-left text-xs text-red-900 transition ease-in hover:bg-red-400 hover:text-white'
              onClick={() => leaveWebcam()}
            >
              {t('footer.menus.leave-webcam')}
            </p>
          )}
        </Menu.Item>
      </div>
    </Menu.Items>
  );
};

export default WebcamMenuItems;
