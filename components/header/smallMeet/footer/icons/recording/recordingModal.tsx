import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

import { RecordingType } from './IRecording';
import { IRecordingFeatures } from '@/store/slices/interfaces/session';
import { useTranslations } from 'next-intl';

interface IRecordingModalProps {
  showModal: boolean;
  recordingFeatures: IRecordingFeatures;
  onCloseModal(recordingType: RecordingType): void;
}

const RecordingModal = ({
  showModal,
  recordingFeatures,
  onCloseModal,
}: IRecordingModalProps) => {
  const [recordingType, setRecordingType] = useState<RecordingType | undefined>(
    undefined
  );
  const t = useTranslations('meet');

  const startRecording = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (recordingType) {
      onCloseModal(recordingType);
    }
  };

  const closeModal = () => {
    onCloseModal(RecordingType.RECORDING_TYPE_NONE);
  };

  const displayModal = () => {
    return (
      <>
        <Transition appear show={showModal} as={Fragment}>
          <Dialog
            as='div'
            className='recordingModal fixed inset-0 z-[9999] overflow-y-auto'
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
                    className='mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white ltr:text-left rtl:text-right'
                  >
                    {t('footer.icons.how-to-record')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-6'>
                    <form
                      action='#'
                      method='POST'
                      onSubmit={(e) => startRecording(e)}
                    >
                      <div className='mb-10 pl-3'>
                        <p className='text-sm text-gray-500 dark:text-darkText'>
                          {t('footer.icons.recording-types-des')}
                        </p>
                        <div className='mt-4 space-y-4 pl-2'>
                          {recordingFeatures.is_allow_local ? (
                            <div className='flex items-center'>
                              <input
                                type='radio'
                                value='1'
                                name='block'
                                id='yes'
                                checked={
                                  recordingType ===
                                  RecordingType.RECORDING_TYPE_LOCAL
                                }
                                onChange={() =>
                                  setRecordingType(
                                    RecordingType.RECORDING_TYPE_LOCAL
                                  )
                                }
                              />
                              <label
                                htmlFor='yes'
                                className='block text-sm font-medium text-gray-700 dark:text-darkText ltr:ml-3 rtl:mr-3'
                              >
                                {t('footer.icons.local-recording')}
                              </label>
                            </div>
                          ) : null}
                          {recordingFeatures.is_allow_cloud ? (
                            <div className='flex items-center'>
                              <input
                                type='radio'
                                value='0'
                                name='block'
                                id='no'
                                checked={
                                  recordingType ===
                                  RecordingType.RECORDING_TYPE_CLOUD
                                }
                                onChange={() =>
                                  setRecordingType(
                                    RecordingType.RECORDING_TYPE_CLOUD
                                  )
                                }
                              />
                              <label
                                htmlFor='no'
                                className='block text-sm font-medium text-gray-700 dark:text-darkText ltr:ml-3 rtl:mr-3'
                              >
                                {t('footer.icons.cloud-recording')}
                              </label>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className='mt-4 bg-gray-50 py-3 text-right dark:bg-transparent'>
                        <button
                          type='submit'
                          className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondaryColor focus:bg-secondaryColor focus:outline-none focus:ring-2 focus:ring-offset-2'
                        >
                          {t('footer.icons.start-recording')}
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

  return displayModal();
};

export default RecordingModal;
