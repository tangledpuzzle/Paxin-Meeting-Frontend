import React, { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { toast } from 'react-toastify';

import { useCreatePollMutation } from '@/store/services/pollsApi';
import { CreatePollReq } from '@/helpers/proto/plugnmeet_polls_pb';
import { useTranslations } from 'next-intl';

interface CreatePollOptions {
  id: number;
  text: string;
}

const Create = () => {
  const t = useTranslations('meet');

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');
  const [createPoll, { isLoading, data }] = useCreatePollMutation();

  const [options, setOptions] = useState<CreatePollOptions[]>([
    {
      id: 1,
      text: '',
    },
    {
      id: 2,
      text: '',
    },
  ]);

  useEffect(() => {
    if (!isLoading && data) {
      if (data.status) {
        toast(t('polls.created-successfully'), {
          type: 'info',
        });
      } else {
        // @ts-ignore
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
    setQuestion('');
    setOptions([
      {
        id: 1,
        text: '',
      },
      {
        id: 2,
        text: '',
      },
    ]);
  };

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const body = new CreatePollReq({
      question,
      options,
    });
    createPoll(body);
  };

  const onChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const currenOptions = [...options];
    currenOptions[index].text = e.currentTarget.value;
    setOptions([...currenOptions]);
  };

  const removeOption = (index: number) => {
    const currenOptions = [...options];
    currenOptions.splice(index, 1);
    setOptions([...currenOptions]);
  };

  const addOption = () => {
    const currenOptions = [...options];
    const newOpt = {
      id: currenOptions[currenOptions.length - 1].id + 1,
      text: '',
    };
    currenOptions.push(newOpt);
    setOptions([...currenOptions]);
  };

  const renderForm = () => {
    return (
      <form onSubmit={onSubmit}>
        <label className='mb-1 block text-base text-black dark:text-darkText'>
          {t('polls.enter-question')}
        </label>
        <input
          type='text'
          name='question'
          value={question}
          required={true}
          onChange={(e) => setQuestion(e.currentTarget.value)}
          placeholder='Ask a question'
          className='mb-4 w-full rounded-lg border border-solid border-primaryColor bg-transparent px-4 py-2 text-base text-black outline-none  placeholder:text-darkText dark:border-darkText dark:text-darkText'
        />
        <div className='flex items-start justify-between border-t border-solid border-primaryColor/20 pb-2 pt-4 dark:border-darkText/30'>
          <p className='block text-lg leading-4 text-black dark:text-darkText'>
            {t('polls.options')}
          </p>
          <button
            className='h-7 rounded-lg bg-primaryColor px-3 text-center text-sm font-semibold leading-[28px] text-white transition ease-in hover:bg-secondaryColor'
            type='button'
            onClick={() => addOption()}
          >
            {t('polls.add-new-option')}
          </button>
        </div>
        <div className='option-field-wrapper scrollBar scrollBar2 h-full max-h-[345px] overflow-auto'>
          <div className='option-field-inner'>
            {options.map((elm, index) => (
              <div className='form-inline mb-4' key={elm.id}>
                <div className='input-wrapper flex w-full items-center'>
                  <input
                    type='text'
                    required={true}
                    name={`opt_${elm.id}`}
                    value={elm.text}
                    onChange={(e) => onChange(index, e)}
                    placeholder={t('polls.option', {
                      count: index + 1,
                    }).toString()}
                    className='w-[calc(100%-36px)] rounded-lg border border-solid border-primaryColor bg-transparent px-4 py-2 text-base text-black outline-none placeholder:text-darkText dark:border-darkText dark:text-darkText'
                  />
                  {index ? (
                    <button
                      type='button'
                      className='ml-2 p-1'
                      onClick={() => removeOption(index)}
                    >
                      <i className='pnm-delete size-5 dark:text-secondaryColor' />
                    </button>
                  ) : null}
                </div>
              </div>
            ))}
            {isLoading ? (
              <div className='loading absolute inset-x-0 top-1/2 z-[999] m-auto -translate-y-1/2 text-center'>
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
            className='h-8 rounded-lg bg-primaryColor px-6 text-center text-base font-semibold leading-[32px] text-white transition ease-in hover:bg-secondaryColor'
            type='submit'
          >
            {t('polls.create-poll')}
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
                <div className='my-8 inline-block w-full max-w-lg overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary'>
                  <button
                    className='close-btn absolute right-6 top-8 size-[25px] outline-none'
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
                    {t('polls.create')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-6'>{renderForm()}</div>
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
      {isOpen ? renderModal() : null}
      <button
        onClick={() => setIsOpen(true)}
        className='mb-2 ml-[10px] h-10 w-[calc(100%-20px)] rounded-lg bg-primaryColor text-center text-base font-semibold leading-[40px] text-white transition ease-in hover:bg-secondaryColor'
      >
        {t('polls.create')}
      </button>
    </>
  );
};

export default Create;
