import React from 'react';

import './style.scss';

interface ILoadingProps {
  text: string;
}
const Loading = ({ text }: ILoadingProps) => {
  return (
    <div
      className={`loader opacity-1  left-0 flex size-full flex-wrap items-center justify-center bg-white/90 dark:bg-darkPrimary/90`}
    >
      <div className='inner'>
        <div className='lds-ripple'>
          <div className='border-secondaryColor' />
          <div className='border-secondaryColor' />
        </div>
        <p className='relative bottom-4 block w-full text-center capitalize dark:text-darkText'>
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loading;
