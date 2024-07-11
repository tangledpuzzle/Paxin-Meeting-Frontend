import React, { useEffect, useState } from 'react';
import { Menu } from '@headlessui/react';
import { createSelector } from '@reduxjs/toolkit';
import { Room, Track } from 'livekit-client';

import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateSelectedAudioDevice } from '@/store/slices/roomSettingsSlice';
import {
  updateIsActiveMicrophone,
  updateIsMicMuted,
} from '@/store/slices/bottomIconsActivitySlice';
import { useTranslations } from 'next-intl';

interface IMicMenuItemsProps {
  currentRoom: Room;
}

const audioDevicesSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.audioDevices
);
const isMicMutedSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.isMicMuted
);
const selectedAudioDeviceSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.selectedAudioDevice
);

const MicMenuItems = ({ currentRoom }: IMicMenuItemsProps) => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const audioDevices = useAppSelector(audioDevicesSelector);
  const isMicMuted = useAppSelector(isMicMutedSelector);
  const selectedAudioDevice = useAppSelector(selectedAudioDeviceSelector);

  const [devicesMenu, setDevicesMenu] = useState<Array<JSX.Element>>();
  const [newDevice, setNewDevice] = useState<string>();

  useEffect(() => {
    const devicesMenu = audioDevices.map((device) => {
      return (
        <div className='' role='none' key={device.id}>
          <Menu.Item>
            {() => (
              <p
                className={`${
                  selectedAudioDevice === device.id
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
  }, [audioDevices, selectedAudioDevice]);

  useEffect(() => {
    const changeDevice = async (id: string) => {
      await currentRoom.switchActiveDevice('audioinput', id);
    };
    if (newDevice) {
      changeDevice(newDevice);
      dispatch(updateSelectedAudioDevice(newDevice));
    }
  }, [newDevice, currentRoom, dispatch]);

  const muteUnmuteMic = () => {
    currentRoom?.localParticipant.trackPublications.forEach(
      async (publication) => {
        if (
          publication.track &&
          publication.track.source === Track.Source.Microphone
        ) {
          if (publication.isMuted) {
            await publication.track.unmute();
            dispatch(updateIsMicMuted(false));
          } else {
            await publication.track.mute();
            dispatch(updateIsMicMuted(true));
          }
        }
      }
    );
  };

  const leaveMic = () => {
    currentRoom?.localParticipant.trackPublications.forEach(
      async (publication) => {
        if (publication.track && publication.kind === Track.Kind.Audio) {
          currentRoom.localParticipant.unpublishTrack(publication.track, true);
        }
      }
    );
    dispatch(updateIsActiveMicrophone(false));
    dispatch(updateIsMicMuted(false));
    dispatch(updateSelectedAudioDevice(''));
  };

  const menuItems = () => {
    return (
      <Menu.Items
        static
        className='ring-opacity/5 absolute bottom-[40px] z-[9999] mt-2 w-40 origin-bottom-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none dark:divide-secondaryColor dark:bg-darkPrimary dark:ring-secondaryColor ltr:left-0 rtl:-left-4'
      >
        {devicesMenu}
        <div className='' role='none'>
          <Menu.Item>
            {() => (
              <p
                className='group flex cursor-pointer items-center rounded px-3 py-[0.4rem] text-xs text-gray-700 transition ease-in hover:bg-primaryColor hover:text-white dark:text-darkText'
                onClick={() => muteUnmuteMic()}
              >
                {isMicMuted
                  ? t('footer.menus.unmute-microphone')
                  : t('footer.menus.mute-microphone')}
              </p>
            )}
          </Menu.Item>
        </div>
        <div className='' role='none'>
          <Menu.Item>
            {() => (
              <p
                className='group flex w-full cursor-pointer items-center rounded-md px-2 py-[0.4rem] text-left text-xs text-red-900 transition ease-in hover:bg-red-400 hover:text-white'
                onClick={() => leaveMic()}
              >
                {t('footer.menus.leave-microphone')}
              </p>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    );
  };

  return <>{menuItems()}</>;
};

export default MicMenuItems;
