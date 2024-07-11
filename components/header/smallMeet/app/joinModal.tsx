import React, { useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { toggleStartup } from '@/store/slices/sessionSlice';
import { updateShowMicrophoneModal } from '@/store/slices/bottomIconsActivitySlice';
import { updateRoomAudioVolume } from '@/store/slices/roomSettingsSlice';
import { useTranslations } from 'next-intl';

interface StartupJoinModalProps {
  onCloseModal(): void;
}

const isStartupSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.isStartup
);
const StartupJoinModal = ({ onCloseModal }: StartupJoinModalProps) => {
  const [open, setOpen] = useState<boolean>(true);
  useAppSelector(isStartupSelector);
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const onClose = (noAudio = false) => {
    setOpen(false);
    dispatch(toggleStartup(false));
    if (noAudio) {
      dispatch(updateRoomAudioVolume(0));
    }
    onCloseModal();
  };

  const shareMic = () => {
    dispatch(updateShowMicrophoneModal(true));
    onClose();
  };

  const render = () => {
    return (
      <div
        id='startupJoinModal'
        className={`${
          open
            ? 'opacity-1 pointer-events-auto'
            : 'pointer-events-none opacity-0'
        } join-the-audio-popup absolute left-0 top-0 z-[999] flex size-full items-center justify-center bg-white/80 px-6 transition ease-in dark:bg-darkPrimary/90`}
      >
        <div className='popup-inner relative w-full max-w-md rounded-2xl bg-white px-6 py-14 shadow-header dark:bg-darkPrimary/90'>
          <button
            className='close-btn absolute right-6 top-8 size-[25px] outline-none'
            type='button'
            onClick={() => onClose(true)}
          >
            <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
            <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
          </button>
          <p className='primaryColor mb-5 text-center text-base font-normal dark:text-darkText md:text-lg'>
            {t('app.how-to-join')}
          </p>
          <div className='flex justify-center'>
            <button
              type='button'
              className='microphone bg-transparent text-center ltr:mr-4 rtl:ml-4'
              onClick={() => shareMic()}
            >
              <div className='m-auto mb-1 flex size-[40px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] dark:bg-darkSecondary3 hover:dark:bg-darkSecondary2 md:size-[60px]'>
                <i className='pnm-mic-unmute primaryColor text-xl dark:text-secondaryColor' />
              </div>
              <p className='primaryColor text-sm font-normal dark:text-darkText md:text-base'>
                {t('app.microphone')}
              </p>
            </button>
            <button
              type='button'
              id='listenOnlyJoin'
              className='headphone bg-transparent text-center ltr:ml-4 rtl:mr-4'
            >
              <div
                className='camera m-auto mb-1 flex size-[40px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] dark:bg-darkSecondary3 hover:dark:bg-darkSecondary2 md:size-[60px]'
                onClick={() => onClose()}
              >
                <i className='pnm-listen-only primaryColor text-xl dark:text-secondaryColor' />
              </div>
              <p className='primaryColor text-sm font-normal dark:text-darkText md:text-base'>
                {t('app.listen-only')}
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // return isStartup ? (
  //   <div className='absolute left-0 top-0 z-50 h-full w-full'>{render()}</div>
  // ) : null;
  return (
    <div className='absolute left-0 top-0 z-50 size-full'>{render()}</div>
  );
};

export default StartupJoinModal;
