import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

import { store } from '@/store';
import {
  CommonResponse,
  RemoveParticipantReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import sendAPIRequest from '@/helpers/api/plugNmeetAPI';
import { useTranslations } from 'next-intl';

export interface IRemoveParticipantAlertModalData {
  name: string;
  userId: string;
  removeType: string;
}

interface IRemoveParticipantAlertModalProps {
  name: string;
  userId: string;
  removeType: string;
  closeAlertModal: () => void;
}

const RemoveParticipantAlertModal = ({
  name,
  userId,
  removeType,
  closeAlertModal,
}: IRemoveParticipantAlertModalProps) => {
  const t = useTranslations('meet');
  const [blockUser, setBlockUser] = useState<number>(0);

  const onCloseRemoveParticipantAlert = async (remove = false) => {
    if (!remove) {
      closeAlertModal();
      return;
    }

    const session = store.getState().session;
    const body = new RemoveParticipantReq({
      sid: session.currentRoom.sid,
      roomId: session.currentRoom.room_id,
      userId: userId,
      msg:
        removeType === 'remove'
          ? t('notifications.you-have-removed').toString()
          : t('notifications.you-have-reject').toString(),
      blockUser: blockUser === 1,
    });

    const r = await sendAPIRequest(
      'removeParticipant',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (res.status) {
      toast(t('left-panel.menus.notice.participant-removed'), {
        toastId: 'user-remove-status',
        type: 'info',
      });
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        type: 'error',
      });
    }
    closeAlertModal();
  };

  return (
    <Transition
      show={true}
      enter='transition duration-100 ease-out'
      enterFrom='transform scale-95 opacity-0'
      enterTo='transform scale-100 opacity-100'
      leave='transition duration-75 ease-out'
      leaveFrom='transform scale-100 opacity-100'
      leaveTo='transform scale-95 opacity-0'
    >
      <Dialog
        open={true}
        onClose={() => onCloseRemoveParticipantAlert()}
        className='remove-participants-popup fixed inset-0 z-[99999] overflow-y-auto'
      >
        <div className='flex min-h-screen items-center justify-center'>
          <Dialog.Overlay className='fixed inset-0 bg-black opacity-30' />

          <div className='popup-inner relative w-full max-w-sm rounded-3xl bg-white px-4 py-12 shadow-header dark:bg-darkPrimary lg:px-6 lg:py-14'>
            <button
              className='close-btn absolute right-6 top-8 h-[25px] w-[25px] outline-none'
              type='button'
              onClick={() => onCloseRemoveParticipantAlert()}
            >
              <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
              <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
            </button>
            <Dialog.Title className='mb-4 text-sm md:mb-6'>
              <legend className='text-base font-medium text-gray-900 dark:text-white'>
                {t('left-panel.menus.notice.confirm', {
                  name,
                })}
              </legend>
            </Dialog.Title>

            <div className='mb-10 pl-3'>
              <p className='text-sm text-gray-500 dark:text-darkText'>
                {t('left-panel.menus.notice.want-to-block')}
              </p>
              <div className='mt-4 space-y-4 pl-2'>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    value='1'
                    name='block'
                    id='yes'
                    checked={blockUser === 1}
                    onChange={(e) =>
                      setBlockUser(Number(e.currentTarget.value))
                    }
                  />
                  <label
                    htmlFor='yes'
                    className='ml-3 block text-sm font-medium text-gray-700 dark:text-darkText'
                  >
                    {t('yes')}
                  </label>
                </div>
                <div className='flex items-center'>
                  <input
                    type='radio'
                    value='0'
                    name='block'
                    id='no'
                    checked={blockUser === 0}
                    onChange={(e) =>
                      setBlockUser(Number(e.currentTarget.value))
                    }
                  />
                  <label
                    htmlFor='no'
                    className='ml-3 block text-sm font-medium text-gray-700 dark:text-darkText'
                  >
                    {t('no')}
                  </label>
                </div>
              </div>
            </div>

            <button
              className='mr-4 inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:text-sm'
              onClick={() => onCloseRemoveParticipantAlert(true)}
            >
              {t('left-panel.menus.notice.remove')}
            </button>

            <button
              className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-xs font-medium text-white hover:bg-secondaryColor focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 md:text-sm'
              onClick={() => onCloseRemoveParticipantAlert(false)}
            >
              {t('cancel')}
            </button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RemoveParticipantAlertModal;
