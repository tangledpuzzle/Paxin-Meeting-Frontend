import React, { useState, Fragment, useContext } from 'react';
import { Room } from 'livekit-client';
import { createSelector } from '@reduxjs/toolkit';
import { Dialog, Menu, Transition } from '@headlessui/react';

import { RootState } from '@/store';
import { useAppDispatch, useAppSelector, useAppStore } from '@/store/hook';

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
import HeaderMenus from './menus';
import RoomSettings from '../header/room-settings';
import KeyboardShortcuts from '../header/keyboardShortcuts';
import {
  CommonResponse,
  RoomEndAPIReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { toast } from 'react-toastify';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { useRouter } from 'next/navigation';
import { RTCContext } from '@/provider/webRTCProvider';
interface IFooterProps {
  currentRoom: Room;
  isRecorder: boolean;
}

const footerVisibilitySelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.visibleFooter
);

const Footer = ({ currentRoom, isRecorder }: IFooterProps) => {
  const store = useAppStore();
  const { clearSession } = useContext(RTCContext);
  const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;
  const footerVisible = useAppSelector(footerVisibilitySelector);
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [alertText, setAlertText] = useState('');
  const [task, setTask] = useState('');
  const router = useRouter();
  function goBack() {
    router.push('/profile/conference');
  }
  const onCloseAlertModal = async (shouldDo = false) => {
    setShowModal(false);
    if (!shouldDo) {
      return;
    }

    if (task === 'logout') {
      // await currentRoom.disconnect();
      await clearSession();
      goBack();
    } else if (task === 'end Room') {
      const session = store.getState().session;

      const body = new RoomEndAPIReq({
        roomId: session.currentRoom.room_id,
      });

      const r = await sendAPIRequest(
        'endRoom',
        body.toBinary(),
        false,
        'application/protobuf',
        'arraybuffer'
      );
      const res = CommonResponse.fromBinary(new Uint8Array(r));
      if (!res.status) {
        toast(res.msg, {
          type: 'error',
        });
      }
      await clearSession();
      goBack();
    } else if (task == 'stepOut') {
      goBack();
    }
  };
  const alertModal = () => {
    return (
      <>
        <Transition appear show={showModal} as={Fragment}>
          <Dialog
            as='div'
            className='AlertModal fixed inset-0 z-[9999] overflow-y-auto'
            onClose={() => false}
          >
            <div className='min-h-screen px-4 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0'
                enterTo='opacity-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100'
                leaveTo='opacity-0'
              >
                <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />
              </Transition.Child>

              <span
                className='inline-block h-screen align-middle'
                aria-hidden='true'
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <div className='my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary'>
                  <button
                    className='close-btn absolute right-6 top-8 h-[25px] w-[25px] outline-none'
                    type='button'
                    onClick={() => onCloseAlertModal()}
                  >
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
                  </button>

                  <Dialog.Title
                    as='h3'
                    className='text-lg font-medium leading-6 text-gray-900 dark:text-white'
                  >
                    {t('header.menus.alert.confirm')}
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-gray-500 dark:text-darkText'>
                      {alertText}
                    </p>
                  </div>

                  <div className='mt-4'>
                    <button
                      className='inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ltr:mr-4 rtl:ml-4'
                      onClick={() => onCloseAlertModal(true)}
                    >
                      {t('ok')}
                    </button>
                    <button
                      type='button'
                      className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white hover:bg-secondaryColor focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                      onClick={() => onCloseAlertModal(false)}
                    >
                      {t('close')}
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };
  const onOpenAlert = (e: string) => {
    setTask(e);
    if (e === 'logout') {
      setAlertText(t('header.menus.alert.logout').toString());
    } else if (e === 'end Room') {
      setAlertText(t('header.menus.alert.end').toString());
    }
    setShowModal(true);
  };

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
          className={`light:bg-primary relative z-[9999] flex h-[55px] items-center justify-between px-2 shadow-footer dark:bg-darkPrimary md:px-4 lg:h-[60px]`}
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
              <Menu>
                {({ open }) => (
                  <>
                    <Menu.Button className='relative flex-shrink-0 p-2 rtl:-ml-4'>
                      <div className='h-5 w-5 rotate-90 '>
                        <i className='pnm-menu-small dark:text-secondaryColor' />
                      </div>
                    </Menu.Button>

                    {/* Use the Transition component. */}
                    <Transition
                      show={open}
                      enter='transition duration-100 ease-out'
                      enterFrom='transform scale-95 opacity-0'
                      enterTo='transform scale-100 opacity-100'
                      leave='transition duration-75 ease-out'
                      leaveFrom='transform scale-100 opacity-100'
                      leaveTo='transform scale-95 opacity-0'
                    >
                      <HeaderMenus onOpenAlert={(e) => onOpenAlert(e)} />
                    </Transition>
                  </>
                )}
              </Menu>
            </div>

            <div className='footer-right hidden w-52 items-center sm:flex' />
            <BreakoutRoomInvitation currentRoom={currentRoom} />
          </div>

          {showModal ? alertModal() : null}
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
            {footerVisible ? t('footer.hide-footer') : t('footer.show-footer')}
          </span>
        </div>
      )}
      <RoomSettings />
      <KeyboardShortcuts />
    </>
  );
  //eslint-disable-next-line
};

export default Footer;
