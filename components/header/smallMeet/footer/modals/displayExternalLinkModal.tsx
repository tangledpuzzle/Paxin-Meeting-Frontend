import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';
import { createSelector } from '@reduxjs/toolkit';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateDisplayExternalLinkRoomModal } from '@/store/slices/bottomIconsActivitySlice';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import {
  CommonResponse,
  ExternalDisplayLinkReq,
  ExternalDisplayLinkTask,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

const isActiveSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features
      .display_external_link_features,
  (display_external_link_features) => display_external_link_features?.is_active
);

const DisplayExternalLinkModal = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const isActive = useAppSelector(isActiveSelector);
  const [link, setLink] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>();
  const [extraValues, setExtraValues] = useState({
    name: false,
    userId: false,
    role: false,
    meetingId: false,
  });

  const closeStartModal = () => {
    dispatch(updateDisplayExternalLinkRoomModal(false));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(undefined);

    let url;
    try {
      url = new URL(link);
    } catch (_) {
      setErrorMsg(t('external-display-link-display.link-invalid').toString());
      return;
    }

    const session = store.getState().session;
    if (extraValues.name) {
      url.searchParams.set('name', session.currentUser?.name ?? '');
    }
    if (extraValues.userId) {
      url.searchParams.set('userId', session.currentUser?.userId ?? '');
    }
    if (extraValues.role) {
      url.searchParams.set(
        'role',
        session.currentUser?.metadata?.is_admin ? 'admin' : 'participant'
      );
    }
    if (extraValues.meetingId) {
      url.searchParams.set('meetingId', session.currentRoom.room_id);
    }

    const id = toast.loading(t('please-wait'), {
      type: 'info',
    });

    const body = new ExternalDisplayLinkReq({
      task: ExternalDisplayLinkTask.START_EXTERNAL_LINK,
      url: url.toString(),
    });
    const r = await sendAPIRequest(
      'externalDisplayLink',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (!res.status) {
      toast.update(id, {
        // @ts-ignore
        render: t(res.msg),
        type: 'error',
        isLoading: false,
        autoClose: 1000,
      });
    }

    toast.dismiss(id);
    dispatch(updateDisplayExternalLinkRoomModal(false));
  };

  const renderDisplayForm = () => {
    return (
      <>
        <Transition appear show={!isActive} as={Fragment}>
          <Dialog
            as='div'
            className='external-link-modal fixed inset-0 z-[9999] overflow-y-auto'
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
                <div className='my-8 inline-block w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary'>
                  <button
                    className='close-btn absolute top-8 h-[25px] w-[25px] outline-none ltr:right-6 rtl:left-6'
                    type='button'
                    onClick={() => closeStartModal()}
                  >
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
                  </button>

                  <Dialog.Title
                    as='h3'
                    className='mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white ltr:text-left rtl:text-right'
                  >
                    {t('external-display-link-display.modal-title')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-6'>
                    <form method='POST' onSubmit={(e) => onSubmit(e)}>
                      <div className=''>
                        <label
                          htmlFor='stream-key'
                          className='block text-sm font-medium text-gray-700 dark:text-darkText'
                        >
                          {t('external-display-link-display.url')}
                        </label>
                        <input
                          type='text'
                          name='stream-key'
                          id='stream-key'
                          value={link}
                          onChange={(e) => setLink(e.currentTarget.value)}
                          className='mt-1 block h-10 w-full rounded-md border border-solid border-black/50 bg-transparent px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-darkText dark:text-darkText sm:text-sm'
                        />
                        {errorMsg ? (
                          <div className='error-msg py-2 text-xs text-red-600'>
                            {errorMsg}
                          </div>
                        ) : null}
                        <div className='py-2 text-xs dark:text-darkText'>
                          {t('external-display-link-display.note')}
                        </div>
                      </div>
                      <div className='mt-4'>
                        <fieldset>
                          <div
                            className='text-base font-medium text-gray-900 dark:text-white'
                            aria-hidden='true'
                          >
                            {t(
                              'external-display-link-display.send-extra-values'
                            )}
                          </div>
                          <div className='mt-4 flex flex-wrap justify-between'>
                            <div className='mb-4 w-1/2 md:w-1/4'>
                              <div className='mb-2 flex w-full items-center justify-center'>
                                <input
                                  id='name'
                                  name='name'
                                  type='checkbox'
                                  checked={extraValues.name}
                                  onChange={() => {
                                    const tmp = Object.assign({}, extraValues);
                                    tmp.name = !extraValues.name;
                                    setExtraValues(tmp);
                                  }}
                                  className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                />
                              </div>
                              <div className='w-full text-center text-sm'>
                                <label
                                  htmlFor='name'
                                  className='font-medium text-gray-700 dark:text-darkText'
                                >
                                  {t('external-display-link-display.name')}
                                </label>
                                <p className='text-gray-500 dark:text-darkText/60'>
                                  {t('external-display-link-display.name-des')}
                                </p>
                              </div>
                            </div>
                            <div className='mb-4 w-1/2 md:w-1/4'>
                              <div className='mb-2 flex w-full items-center justify-center'>
                                <input
                                  id='user-id'
                                  name='user-id'
                                  type='checkbox'
                                  checked={extraValues.userId}
                                  onChange={() => {
                                    const tmp = Object.assign({}, extraValues);
                                    tmp.userId = !extraValues.userId;
                                    setExtraValues(tmp);
                                  }}
                                  className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                />
                              </div>
                              <div className='w-full text-center text-sm'>
                                <label
                                  htmlFor='user-id'
                                  className='font-medium text-gray-700 dark:text-darkText'
                                >
                                  {t('external-display-link-display.user-id')}
                                </label>
                                <p className='text-gray-500 dark:text-darkText/60'>
                                  {t(
                                    'external-display-link-display.user-id-des'
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className='mb-4 w-1/2 md:w-1/4'>
                              <div className='mb-2 flex w-full items-center justify-center'>
                                <input
                                  id='user-role'
                                  name='user-role'
                                  type='checkbox'
                                  checked={extraValues.role}
                                  onChange={() => {
                                    const tmp = Object.assign({}, extraValues);
                                    tmp.role = !extraValues.role;
                                    setExtraValues(tmp);
                                  }}
                                  className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                />
                              </div>
                              <div className='w-full text-center text-sm'>
                                <label
                                  htmlFor='user-role'
                                  className='font-medium text-gray-700 dark:text-darkText'
                                >
                                  {t('external-display-link-display.user-role')}
                                </label>
                                <p className='text-gray-500 dark:text-darkText/60'>
                                  {t(
                                    'external-display-link-display.user-role-des'
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className='mb-4 w-1/2 md:w-1/4'>
                              <div className='mb-2 flex w-full items-center justify-center'>
                                <input
                                  id='meeting-id'
                                  name='meeting-id'
                                  type='checkbox'
                                  checked={extraValues.meetingId}
                                  onChange={() => {
                                    const tmp = Object.assign({}, extraValues);
                                    tmp.meetingId = !extraValues.meetingId;
                                    setExtraValues(tmp);
                                  }}
                                  className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                                />
                              </div>
                              <div className='w-full text-center text-sm'>
                                <label
                                  htmlFor='meeting-id'
                                  className='font-medium text-gray-700 dark:text-darkText'
                                >
                                  {t(
                                    'external-display-link-display.meeting-id'
                                  )}
                                </label>
                                <p className='text-gray-500 dark:text-darkText/60'>
                                  {t(
                                    'external-display-link-display.meeting-id-des'
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      <div className='mt-4 bg-gray-50 pb-3 pt-4 text-right dark:bg-transparent'>
                        <button
                          type='submit'
                          className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondaryColor focus:bg-secondaryColor focus:outline-none focus:ring-2 focus:ring-offset-2'
                        >
                          {t('external-display-link-display.display')}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  return <>{!isActive ? renderDisplayForm() : null}</>;
};

export default DisplayExternalLinkModal;
