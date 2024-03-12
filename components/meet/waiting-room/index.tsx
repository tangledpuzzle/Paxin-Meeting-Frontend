import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateShowManageWaitingRoomModal } from '@/store/slices/bottomIconsActivitySlice';
import { participantsSelector } from '@/store/slices/participantSlice';
import { IParticipant } from '@/store/slices/interfaces/participant';
import UpdateRoomMessage from './updateRoomMessage';
import BulkAction from './bulkAction';
import ParticipantsList from './participantsList';
import { useTranslations } from 'next-intl';

const ManageWaitingRoom = () => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();
  const participants = useAppSelector(participantsSelector.selectAll);

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [waitingParticipants, setWaitingParticipants] =
    useState<IParticipant[]>();

  useEffect(() => {
    if (participants.length) {
      const waiting = participants.filter((p) => p.metadata.wait_for_approval);
      setWaitingParticipants(waiting);
    }
  }, [participants]);

  const closeModal = () => {
    setIsOpen(false);
    dispatch(updateShowManageWaitingRoomModal(false));
  };

  const renderModal = () => {
    return (
      <>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog
            as='div'
            className='showManageWaitingRoomModal fixed inset-0 z-[9999] overflow-y-auto'
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
                <div className='my-8 inline-block w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary'>
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
                    className='mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-darkText ltr:text-left rtl:text-right'
                  >
                    {t('waiting-room.modal-title')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-6'>
                    <UpdateRoomMessage />
                    <BulkAction
                      waitingParticipants={waitingParticipants ?? []}
                    />
                    <ParticipantsList
                      waitingParticipants={waitingParticipants ?? []}
                    />
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

export default ManageWaitingRoom;
