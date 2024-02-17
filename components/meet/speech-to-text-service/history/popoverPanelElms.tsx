import React, { Dispatch, useCallback, useRef } from 'react';
import { Popover } from '@headlessui/react';
import Draggable from 'react-draggable';
import { createSelector } from '@reduxjs/toolkit';

import { RootState, store, useAppSelector } from '@/store';
import InterimTextElms from './interimTextElms';
import { useTranslations } from 'next-intl';

interface PopoverPanelElmsProps {
  showPopover: boolean;
  setShowPopover: Dispatch<boolean>;
}

const lastFinalTextsSelector = createSelector(
  (state: RootState) => state.speechServices,
  (speechServices) => speechServices.lastFinalTexts
);

const PopoverPanelElms = ({
  showPopover,
  setShowPopover,
}: PopoverPanelElmsProps) => {
  const t = useTranslations('meet');
  const lastFinalTexts = useAppSelector(lastFinalTextsSelector);

  const nodeRef = useRef(null);

  const downloadTexts = useCallback(() => {
    if (!lastFinalTexts.length) {
      return;
    }

    const texts = lastFinalTexts.map((t) => {
      return `${t.time} ${t.from}:\n${t.text}`;
    });

    const lang = store.getState().speechServices.selectedSubtitleLang;
    const formBlob = new Blob([texts.join('\n\n')], {
      type: 'text/plain;charset=UTF-8',
    });

    const link = document.createElement('a');
    link.setAttribute('href', window.URL.createObjectURL(formBlob));
    link.setAttribute('download', `subtitle_texts_${lang}.txt`);
    document.body.appendChild(link);

    link.click();
    link.remove();
  }, [lastFinalTexts]);

  return (
    <Draggable nodeRef={nodeRef}>
      <Popover.Panel
        className='SpeechHistory h-ful absolute bottom-14 left-0 z-10 mx-1 w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-darkPrimary'
        ref={nodeRef}
        static={showPopover}
      >
        <h2 className='relative cursor-move p-5 px-3 pb-3 text-lg font-medium leading-6 text-gray-900 dark:text-white'>
          {t('speech-services.subtitle-history-modal-title')}
          <button
            className='absolute h-[25px] w-[25px] outline-none ltr:right-10 rtl:left-10'
            onClick={() => downloadTexts()}
          >
            <i className='pnm-download' />
          </button>
          <button
            className='absolute top-7 h-[25px] w-[25px] outline-none ltr:right-3 rtl:left-3'
            onClick={() => setShowPopover(!showPopover)}
          >
            <span className='absolute left-0 top-0 inline-block h-[2px] w-[20px] -rotate-0 bg-primaryColor dark:bg-darkText' />
          </button>
        </h2>
        <hr />
        <div className='scrollBar scrollBar4 h-[200px] overflow-hidden overflow-y-auto p-3 pb-8 text-primary dark:text-white'>
          {lastFinalTexts.slice(-50).map((t) => {
            return (
              <div key={t.id} className='sentence w-full pt-2'>
                <p className='date primaryColor pb-1 text-sm dark:text-darkText'>
                  <span className='text-xs'>{t.time}</span> {t.from}:
                </p>
                <p className='message-content max-w-fit rounded bg-secondaryColor px-2 py-1 text-sm text-white shadow-footer'>
                  {t.text}
                </p>
              </div>
            );
          })}
          <InterimTextElms />
        </div>
      </Popover.Panel>
    </Draggable>
  );
};

export default PopoverPanelElms;
