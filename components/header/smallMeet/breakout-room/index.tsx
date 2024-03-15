import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { store } from '@/store';
import { useAppDispatch } from '@/store/hook';
import { updateShowManageBreakoutRoomModal } from '@/store/slices/bottomIconsActivitySlice';
import FromElems from './form';
import BreakoutRoomLists from './list';
import { useTranslations } from 'next-intl';

const BreakoutRoom = () => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();
  const breakoutRoomIsActive =
    store.getState().session.currentRoom.metadata?.room_features
      .breakout_room_features.is_active;
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const closeModal = () => {
    setIsOpen(false);
    dispatch(updateShowManageBreakoutRoomModal(false));
  };

  const renderModal = () => {
    return (
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as='div'
            className='breakout-room-modal fixed inset-0 z-[9999] overflow-y-auto'
            onClose={() => false}
            static={false}
          >
            <div className='flex min-h-screen items-center justify-center px-4 text-center'>
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
                <div className='my-16 inline-block h-full w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-4 text-left shadow-xl transition-all dark:bg-darkPrimary md:p-6'>
                  <button
                    className='close-btn absolute top-8 h-[25px] w-[25px] outline-none ltr:right-6 rtl:left-6'
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
                    {t('breakout-room.modal-title')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-2'>
                    {breakoutRoomIsActive ? (
                      <BreakoutRoomLists />
                    ) : (
                      <FromElems />
                    )}
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  return renderModal();
};

export default BreakoutRoom;
