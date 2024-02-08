import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { createSelector } from '@reduxjs/toolkit';

import { RootState, useAppDispatch, useAppSelector } from '@/store';
import { updateShowKeyboardShortcutsModal } from '@/store/slices/roomSettingsSlice';
import { useTranslations } from 'next-intl';

const isShowKeyboardShortcutsSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.isShowKeyboardShortcuts
);

const KeyboardShortcuts = () => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const isShowKeyboardShortcuts = useAppSelector(
    isShowKeyboardShortcutsSelector
  );

  const closeModal = () => {
    dispatch(updateShowKeyboardShortcutsModal(false));
  };

  const render = () => {
    return (
      <>
        <Transition appear show={isShowKeyboardShortcuts} as={Fragment}>
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
                <div className='my-8 inline-block w-full max-w-xl transform overflow-hidden rounded-2xl bg-white px-4 py-6 text-left align-middle shadow-xl transition-all dark:bg-darkPrimary lg:px-6'>
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
                    className='mb-2 text-lg font-medium leading-6 text-gray-900 dark:text-white'
                  >
                    {t('header.keyboard-shortcuts.title')}
                  </Dialog.Title>
                  <hr />
                  <div className='mt-2'>
                    <table className='w-full border-collapse border border-slate-500 dark:border-darkText'>
                      <thead>
                        <tr>
                          <th className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            <strong>
                              {t('header.keyboard-shortcuts.key-comb')}
                            </strong>
                          </th>
                          <th className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            <strong>
                              {t('header.keyboard-shortcuts.actions')}
                            </strong>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + m
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base '>
                            {t('header.keyboard-shortcuts.mute-unmute')}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + a
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t('header.keyboard-shortcuts.start-audio')}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + o
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t('header.keyboard-shortcuts.leave-audio')}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + v
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t('header.keyboard-shortcuts.start-webcam')}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + x
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t('header.keyboard-shortcuts.leave-webcam')}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + u
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t('header.keyboard-shortcuts.show-hide-user-list')}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + c
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t('header.keyboard-shortcuts.show-hide-chat')}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + l
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t(
                              'header.keyboard-shortcuts.show-hide-lock-settings'
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + s
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t('header.keyboard-shortcuts.show-hide-settings')}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-b border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + w
                          </td>
                          <td className='border-b border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t(
                              'header.keyboard-shortcuts.show-hide-whiteboard'
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td className='border-r border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            ctrl + alt/option + r
                          </td>
                          <td className='border-slate-700 pl-2 text-xs dark:border-darkText dark:text-darkText sm:text-sm md:text-base'>
                            {t('header.keyboard-shortcuts.show-hide-hand')}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  };

  return <>{isShowKeyboardShortcuts ? render() : null}</>;
};

export default KeyboardShortcuts;
