import React, { Fragment } from 'react';
import { Dialog, Tab, Transition } from '@headlessui/react';

import { updateShowExternalMediaPlayerModal } from '@/store/slices/bottomIconsActivitySlice';
import { useAppDispatch } from '@/store/hook';
import DirectLink from './directLink';
import Upload from './upload';
import { useTranslations } from 'next-intl';

interface IStartPlaybackModalProps {
  isActive: boolean;
}

const StartPlaybackModal = ({ isActive }: IStartPlaybackModalProps) => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const items = [
    {
      id: 1,
      title: <>{t('footer.modal.external-media-player-direct-link')}</>,
      elm: <DirectLink />,
    },
    {
      id: 2,
      title: <>{t('footer.modal.external-media-player-upload-file')}</>,
      elm: <Upload />,
    },
  ];

  const closeStartModal = () => {
    dispatch(updateShowExternalMediaPlayerModal(false));
  };

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <>
      <Transition appear show={!isActive} as={Fragment}>
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
                  {t('footer.modal.external-media-player-title')}
                </Dialog.Title>
                <hr />
                <div className='mt-6'>
                  <Tab.Group vertical>
                    <Tab.List className='flex'>
                      {items.map((item) => (
                        <Tab
                          key={item.id}
                          className={({ selected }) =>
                            classNames(
                              'w-full border-b-4 border-solid py-2 text-xs font-bold leading-5 text-black transition ease-in dark:text-darkText',
                              selected
                                ? 'border-[#004d90]'
                                : 'border-[#004d90]/20'
                            )
                          }
                        >
                          <div className='name relative inline-block'>
                            {item.title}
                          </div>
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels className='relative h-[calc(100%-45px)]'>
                      {items.map((item) => (
                        <Tab.Panel
                          key={item.id}
                          className={`${
                            item.id === 2 || item.id === 3
                              ? 'polls h-full'
                              : 'scrollBar h-full overflow-auto pt-2 xl:pt-5'
                          }`}
                        >
                          <>{item.elm}</>
                        </Tab.Panel>
                      ))}
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default StartPlaybackModal;
