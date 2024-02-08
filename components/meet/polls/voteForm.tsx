import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  useAddResponseMutation,
  useGetPollListsQuery,
} from '@/store/services/pollsApi';
import { store } from '@/store';
import { toast } from 'react-toastify';
import { SubmitPollResponseReq } from '@/helpers/proto/plugnmeet_polls_pb';
import { useTranslations } from 'next-intl';

interface IVoteFormProps {
  onCloseForm(): void;
  pollId: string;
}

const VoteForm = ({ onCloseForm, pollId }: IVoteFormProps) => {
  const t = useTranslations('meet');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const [addResponse, { isLoading, data }] = useAddResponseMutation();
  const { post: poll } = useGetPollListsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      post: data?.polls.find((poll) => poll.id === pollId),
    }),
  });

  useEffect(() => {
    if (!isLoading && data) {
      if (data.status) {
        toast(t('polls.response-added'), {
          type: 'info',
        });
      } else {
        toast(t(data.msg), {
          type: 'error',
        });
      }
      closeModal();
    }
    //eslint-disable-next-line
  }, [isLoading, data]);

  const closeModal = () => {
    setIsOpen(false);
    onCloseForm();
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (selectedOption === 0) {
      return;
    }
    addResponse(
      new SubmitPollResponseReq({
        pollId: pollId,
        userId: store.getState().session.currentUser?.userId ?? '',
        name: store.getState().session.currentUser?.name ?? '',
        selectedOption: BigInt(selectedOption),
      })
    );
  };

  const renderForm = () => {
    return (
      <form onSubmit={onSubmit}>
        <label className='mb-2 block border-b border-solid border-primaryColor/20 pb-1 text-base text-black dark:border-darkText/20 dark:text-darkText'>
          <span className='text-primaryColor dark:text-secondaryColor'>Q:</span>
          {poll?.question}
        </label>
        <div className=''>
          <p className='mb-2 block border-b border-solid border-primaryColor/20 pb-1 text-base text-black dark:border-darkText/20 dark:text-white'>
            {t('polls.select-option')}
          </p>
          <div className='relative mb-2 min-h-[75px]'>
            {poll?.options.map((o) => {
              return (
                <div key={o.id} className='flex items-center'>
                  <input
                    type='radio'
                    id={`option-${o.id}`}
                    value={o.id}
                    name={`option-${o.id}`}
                    checked={selectedOption === o.id}
                    onChange={(e) =>
                      setSelectedOption(Number(e.currentTarget.value))
                    }
                  />
                  <label
                    className='ml-2 dark:text-darkText'
                    htmlFor={`option-${o.id}`}
                  >
                    {o.text}
                  </label>
                </div>
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

        <div className='button-section flex items-center justify-end'>
          <button
            className='h-7 rounded-lg bg-primaryColor px-6 text-center text-base font-semibold leading-[28px] text-white transition ease-in hover:bg-secondaryColor'
            type='submit'
          >
            {t('polls.submit')}
          </button>
        </div>
      </form>
    );
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
                    {t('polls.submit-vote-form-title')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-2'>{renderForm()}</div>
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

export default VoteForm;
