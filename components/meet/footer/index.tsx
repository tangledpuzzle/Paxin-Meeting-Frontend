import React, { useMemo } from 'react';
import { Room } from 'livekit-client';
import { createSelector } from '@reduxjs/toolkit';
import { Transition } from '@headlessui/react';

import { RootState, store, useAppDispatch, useAppSelector } from '@/store';

import WebcamIcon from './icons/webcam';
import MicrophoneIcon from './icons/microphone';
import ChatIcon from './icons/chat';
import ParticipantIcon from './icons/participant';
import RaiseHandIcon from './icons/raisehand';
import ScreenshareIcon from './icons/screenshare';
import RecordingIcon from './icons/recording';
import MenusIcon from './icons/menus';
import SharedNotePadIcon from './icons/sharedNotePad';
import WhiteboardIcon from './icons/whiteboard';
import BreakoutRoomInvitation from '../breakout-room/breakoutRoomInvitation';
import { toggleFooterVisibility } from '@/store/slices/roomSettingsSlice';
import { useTranslations } from 'next-intl';

interface IFooterProps {
  currentRoom: Room;
  isRecorder: boolean;
}

const footerVisibilitySelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.visibleFooter
);

const Footer = ({ currentRoom, isRecorder }: IFooterProps) => {
  const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;
  const footerVisible = useAppSelector(footerVisibilitySelector);
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  return useMemo(() => {
    return (
      <>
        <Transition
          show={footerVisible}
          unmount={false}
          enter='transform duration-200 transition ease-in'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transform duration-200 transition ease-in'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <footer
            id='main-footer'
            className={`flex h-[55px] items-center justify-between px-2 shadow-footer dark:bg-darkPrimary md:px-4 lg:h-[60px]`}
            style={{ display: isRecorder ? 'none' : '' }}
          >
            <div className='footer-inner flex w-full items-center justify-between rtl:flex-row-reverse'>
              <div className='footer-left relative z-50 flex w-52 items-center rtl:justify-end'>
                <WebcamIcon currentRoom={currentRoom} />
                <MicrophoneIcon currentRoom={currentRoom} />
              </div>

              <div className='footer-middle flex items-center'>
                <ParticipantIcon />
                <ChatIcon />
                <ScreenshareIcon currentRoom={currentRoom} />
                <RaiseHandIcon currentRoom={currentRoom} />
                <WhiteboardIcon />
                <SharedNotePadIcon />
                <RecordingIcon currentRoom={currentRoom} />
                {isAdmin ? <MenusIcon /> : null}
              </div>

              <div className='footer-right hidden w-52 items-center sm:flex' />
              <BreakoutRoomInvitation currentRoom={currentRoom} />
            </div>
          </footer>
        </Transition>
        {isRecorder ? null : (
          <div
            className={`footer-collapse-arrow group fixed right-0 z-[1] flex h-5 w-[50px] cursor-pointer items-end justify-center rounded-tl-lg bg-white dark:bg-darkPrimary ${
              footerVisible ? 'bottom-[60px] pb-[3px]' : 'bottom-0 pb-[6px]'
            }`}
            onClick={() => dispatch(toggleFooterVisibility())}
          >
            <i
              className={` pnm-arrow-below text-[10px] dark:text-secondaryColor sm:text-[12px] ${
                footerVisible ? '' : 'rotate-180'
              }`}
            ></i>
            <span className='invisible absolute bottom-7 right-0 w-max rounded bg-white px-[10px] py-1 text-[12px] text-darkPrimary opacity-0 transition-all group-hover:visible group-hover:opacity-100 dark:bg-darkPrimary dark:text-white'>
              {footerVisible
                ? t('footer.hide-footer')
                : t('footer.show-footer')}
            </span>
          </div>
        )}
      </>
    );
    //eslint-disable-next-line
  }, [currentRoom, footerVisible]);
};

export default Footer;
