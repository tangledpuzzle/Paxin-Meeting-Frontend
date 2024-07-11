import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useGetPollResponsesResultQuery } from '@/store/services/pollsApi';
import { useTranslations } from 'next-intl';

interface IViewResultProps {
  onCloseViewResult(): void;
  pollId: string;
}

const ViewResult = ({ pollId, onCloseViewResult }: IViewResultProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const t = useTranslations('meet');
  const { data, isLoading } = useGetPollResponsesResultQuery(pollId);

  const closeModal = () => {
    setIsOpen(false);
    onCloseViewResult();
  };

  const renderModal = () => {
    return (
      <>
        <Transition appear show={isOpen} as={Fragment}>
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
                <div className='my-8 inline-block w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary'>
                  <button
                    className='close-btn absolute right-6 top-8 h-[25px] w-[25px] outline-none'
                    type='button'
                    onClick={() => closeModal()}
                  >
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] rotate-45 bg-primaryColor dark:bg-darkText' />
                    <span className='absolute left-0 top-0 inline-block h-[1px] w-[20px] -rotate-45 bg-primaryColor dark:bg-darkText' />
                  </button>

                  <Dialog.Title
                    as='h3'
                    className='mb-2 text-left text-lg font-medium leading-6 text-gray-900 dark:text-white'
                  >
                    {t('polls.view-result-title')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-2'>
                    <p className='mb-2 w-full border-b border-solid border-primaryColor/20 pb-1 text-lg font-bold capitalize text-black dark:dark:border-darkText/20 dark:text-darkText'>
                      <span className='text-primaryColor dark:text-secondaryColor'>
                        Q:{' '}
                      </span>
                      {data?.pollResponsesResult?.question}
                    </p>
                    <p className='w-full text-base dark:text-darkText'>
                      {t('polls.total-responses', {
                        count: Number(
                          data?.pollResponsesResult?.totalResponses
                        ),
                      })}
                    </p>
                    <div className='pt-5'>
                      <p className='mb-2 block border-b border-solid border-primaryColor/20 pb-2 text-base text-black dark:dark:border-darkText/20 dark:text-white'>
                        {t('polls.options')}
                      </p>
                      <div className='relative min-h-[75px]'>
                        {data?.pollResponsesResult?.options?.map((o) => {
                          return (
                            <p
                              className='relative flex w-full items-center justify-between dark:text-darkText'
                              key={Number(o.id)}
                            >
                              <span className='inline-block bg-white py-1 pr-2 dark:bg-darkPrimary'>
                                {o.text}
                              </span>
                              <span className='inline-block bg-white py-1 pl-2 dark:bg-darkPrimary'>
                                ({Number(o.voteCount)})
                              </span>
                            </p>
                          );
                        })}
                        {isLoading ? (
                          <div className='loading absolute left-0 right-0 top-1/2 z-[999] m-auto -translate-y-1/2 text-center'>
                            <div className='lds-ripple'>
                              <div className='border-secondaryColor' />
                              <div className='border-secondaryColor' />
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  return <>{isOpen ? renderModal() : null}</>;
};

export default ViewResult;
