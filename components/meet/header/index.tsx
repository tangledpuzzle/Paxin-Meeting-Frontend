import React, { useState, Fragment } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { Dialog, Menu, Transition } from '@headlessui/react';
import { Room } from 'livekit-client';
import { toast } from 'react-toastify';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { useAppSelector, RootState, store, useAppDispatch } from '@/store';
import sendAPIRequest from '@/helpers/api/plugNmeetAPI';

import HeaderMenus from './menus';
import RoomSettings from './room-settings';
import './style.css';
import KeyboardShortcuts from './keyboardShortcuts';
import VolumeControl from './volumeControl';
import DurationView from './durationView';
import DarkThemeSwitcher from './darkThemeSwitcher';
import {
  CommonResponse,
  RoomEndAPIReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { toggleHeaderVisibility } from '@/store/slices/roomSettingsSlice';
import HeaderLogo from './headerLogo';
import { useTranslations } from 'next-intl';
import ThemeToggle from '@/components/theme-toggle';

interface IHeaderProps {
  currentRoom: Room;
}

const roomTitleSelector = createSelector(
  (state: RootState) => state.session.currentRoom.metadata,
  (metadata) => metadata?.room_title
);
const roomIdSelector = createSelector(
  (state: RootState) => state.session.currentRoom.room_id,
  (room_id) => room_id
);
const roomDurationSelector = createSelector(
  (state: RootState) => state.session.currentRoom.metadata?.room_features,
  (room_features) => room_features?.room_duration
);
const headerVisibilitySelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.visibleHeader
);

const Header = ({ currentRoom }: IHeaderProps) => {
  const roomTitle = useAppSelector(roomTitleSelector);
  const roomId = useAppSelector(roomIdSelector);
  const roomDuration = useAppSelector(roomDurationSelector);
  const headerVisible = useAppSelector(headerVisibilitySelector);
  const dispatch = useAppDispatch();

  const t = useTranslations('meet');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [alertText, setAlertText] = useState('');
  const [task, setTask] = useState('');
  const assetPath = (window as any).STATIC_ASSETS_PATH ?? './assets';

  const onOpenAlert = (task) => {
    setTask(task);
    if (task === 'logout') {
      setAlertText(t('header.menus.alert.logout').toString());
    } else if (task === 'end Room') {
      setAlertText(t('header.menus.alert.end').toString());
    }
    setShowModal(true);
  };

  const onCloseAlertModal = async (shouldDo = false) => {
    setShowModal(false);
    if (!shouldDo) {
      return;
    }

    if (task === 'logout') {
      await currentRoom.disconnect();
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

  return (
    <>
      <Transition
        show={headerVisible}
        unmount={false}
        enter='transform duration-200 transition ease-in'
        enterFrom='opacity-0'
        enterTo='opacity-100'
        leave='transform duration-200 transition ease-in'
        leaveFrom='opacity-100'
        leaveTo='opacity-0'
      >
        <header
          id='main-header'
          className={`relative z-[99999] flex h-[50px] items-center justify-between bg-white px-4 shadow-header transition-transform dark:bg-darkPrimary ${
            headerVisible ? 'ac' : ''
          }`}
        >
          <div
            className={`header-before-start pointer-events-none absolute left-[-35px] top-0 h-full w-[300px] bg-cover bg-center`}
            style={{
              backgroundImage: `url("${assetPath}/imgs/header-before2.png")`,
            }}
          />
          <div className='logo relative z-20 w-28'>
            <HeaderLogo />
          </div>
          <div className='middle relative z-20 flex-auto'>
            <h2 className='header-title text-center text-base leading-8 text-black dark:text-white'>
              {roomTitle} (Room ID: {roomId})
              <CopyToClipboard
                text={roomId}
                onCopy={() => {
                  toast.success('Room ID is copied to clipboard!', {
                    position: 'top-center',
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    bodyStyle: {
                      padding: '0',
                      minHeight: '24px',
                      margin: '0',
                    },
                    style: {
                      minHeight: '40px',
                    },
                  });
                }}
              >
                <div className='notepad inline-block h-8 w-8 items-center justify-center rounded-full'>
                  <i className='pnm-notepad h-4 w-4 text-primaryColor dark:text-secondaryColor' />
                </div>
              </CopyToClipboard>
            </h2>
          </div>
          <div className='dark-area relative -right-3 z-20 flex w-28 items-center justify-end'>
            {roomDuration && Number(roomDuration) > 0 ? (
              <DurationView duration={Number(roomDuration)} />
            ) : null}
            <ThemeToggle />
            {/* <DarkThemeSwitcher /> */}
            <VolumeControl />
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
          <div
            className={`header-before-end pointer-events-none absolute right-[-100px] top-0 h-full w-[350px] rotate-[156deg] bg-cover bg-center lg:w-[380px]`}
            style={{
              backgroundImage: `url("${assetPath}/imgs/header-before2.png")`,
            }}
          />
          {showModal ? alertModal() : null}
        </header>
      </Transition>
      <div
        className={`header-collapse-arrow group fixed right-0 z-[2] flex h-5 w-[50px] cursor-pointer items-start justify-center rounded-bl-lg bg-white dark:bg-darkPrimary ${
          headerVisible ? 'top-[50px] pt-[3px]' : 'top-0 pt-[6px]'
        }`}
        onClick={() => dispatch(toggleHeaderVisibility())}
      >
        <i
          className={`pnm-arrow-below text-[10px] dark:text-secondaryColor sm:text-[12px] ${
            headerVisible ? 'rotate-180' : ''
          }`}
        ></i>
        <span className='invisible absolute right-0 top-7 w-max rounded bg-white px-[12px] py-1 text-[10px] text-darkPrimary opacity-0 transition-all group-hover:visible group-hover:opacity-100 dark:bg-darkPrimary dark:text-white'>
          {headerVisible ? t('header.hide-header') : t('header.show-header')}
        </span>
      </div>
      <RoomSettings />
      <KeyboardShortcuts />
    </>
  );
};

export default React.memo(Header);
