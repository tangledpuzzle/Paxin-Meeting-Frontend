import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { Transition, Dialog, Tab } from '@headlessui/react';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateShowRoomSettingsModal } from '@/store/slices/roomSettingsSlice';
import DataSavings from './dataSavings';
import Notification from './notification';
import ApplicationSettings from './application';
import Ingress from './ingress';
import { useTranslations } from 'next-intl';

// declare const PNM_VERSION: string;

const isShowRoomSettingsModalSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.isShowRoomSettingsModal
);
interface RoomSettings {
  [key: string]: { id: number; elm: ReactNode }[];
}

const RoomSettings = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const s = store.getState();
  const serverVersion = s.session.serverVersion;
  const copyright_conf = s.session.currentRoom?.metadata?.copyright_conf;
  const ingressFeatures =
    s.session.currentRoom?.metadata?.room_features.ingress_features;

  const isShowRoomSettingsModal = useAppSelector(
    isShowRoomSettingsModalSelector
  );

  const [categories, setCategories] = useState<RoomSettings>({
    'header.room-settings.application': [
      {
        id: 1,
        elm: <ApplicationSettings />,
      },
    ],
    'header.room-settings.data-savings': [
      {
        id: 2,
        elm: <DataSavings />,
      },
    ],
    'header.room-settings.notifications': [
      {
        id: 3,
        elm: <Notification />,
      },
    ],
  });

  useEffect(() => {
    if (
      s.session?.currentUser?.metadata?.is_admin &&
      ingressFeatures?.is_allow
    ) {
      categories['header.room-settings.ingress'] = [
        {
          id: 4,
          elm: <Ingress />,
        },
      ];
    }

    setCategories(categories);
    //eslint-disable-next-line
  }, []);

  const closeModal = () => {
    dispatch(updateShowRoomSettingsModal(false));
  };

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  const displayBottomText = () => {
    let text = copyright_conf?.display ? `${copyright_conf?.text}&nbsp;` : '';
    text += t('plugnmeet-server-client-version', {
      server: serverVersion,
      client: process.env.NEXT_PUBLIC_PNM_VERSION,
    });
    return (
      <div
        className='absolute inset-x-0 bottom-0 text-center text-xs dark:text-darkText'
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
    );
  };

  const showTabItems = () => {
    return (
      <div className='max-w-full'>
        <Tab.Group vertical>
          <Tab.List className='flex space-x-1 rounded-xl bg-primaryColor p-1'>
            {Object.keys(categories).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    'w-full rounded-lg py-1 text-xs font-medium leading-5 text-secondaryColor outline-none sm:text-sm',
                    'ring-white ring-opacity-60',
                    selected
                      ? 'bg-white text-primaryColor shadow dark:bg-secondaryColor dark:text-white'
                      : 'hover:bg-white/[0.12] hover:text-white'
                  )
                }
              >
                {t(category as any)}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className='mt-2'>
            {Object.values(categories).map((posts, idx) => (
              <Tab.Panel key={idx} className='rounded-xl bg-transparent p-3'>
                <ul>
                  {posts.map((post) => (
                    <li key={post.id}>{post.elm}</li>
                  ))}
                </ul>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>
    );
  };

  return (
    <>
      {isShowRoomSettingsModal && (
        <Transition appear show={isShowRoomSettingsModal} as={Fragment}>
          <Dialog
            as='div'
            className='fixed inset-0 z-[9999] overflow-y-auto'
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
                <div className='my-8 inline-block h-[25rem] w-full max-w-2xl overflow-hidden rounded-2xl bg-white px-4 py-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary lg:px-6'>
                  <button
                    className='close-btn absolute top-8 size-[25px] outline-none ltr:right-6 rtl:left-6'
                    type='button'
                    onClick={() => closeModal()}
                  >
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
                  </button>

                  <Dialog.Title
                    as='h3'
                    className='mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white ltr:text-left rtl:text-right'
                  >
                    {t('header.room-settings.title')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-2'>{showTabItems()}</div>
                  <div className='hidden'>{displayBottomText()}</div>
                  {/* {displayBottomText()} */}
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default RoomSettings;
