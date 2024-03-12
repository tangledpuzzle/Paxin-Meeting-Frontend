import React, { useEffect, useRef } from 'react';
import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/store';
import { useAppSelector } from '@/store/hook';

const interimTextSelector = createSelector(
  (state: RootState) => state.speechServices,
  (speechServices) => speechServices.interimText
);
const InterimTextElms = () => {
  const interimText = useAppSelector(interimTextSelector);
  const scrollToRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (scrollToRef.current) {
        scrollToRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest',
        });
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [interimText]);

  return (
    <>
      {interimText ? (
        <div className='sentence w-full pt-2'>
          <p className='date primaryColor pb-1 text-sm dark:text-darkText'>
            <span className='text-xs'>{interimText.time}</span>{' '}
            {interimText.from}:
          </p>
          <p className='message-content max-w-fit rounded bg-secondaryColor px-2 py-1 text-sm text-white shadow-footer'>
            {interimText.text}
          </p>
        </div>
      ) : null}
      <div className='pt-[5px]' ref={scrollToRef} />
    </>
  );
};

export default InterimTextElms;
