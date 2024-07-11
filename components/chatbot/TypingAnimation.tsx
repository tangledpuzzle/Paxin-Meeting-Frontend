import React from 'react';

const TypingAnimation = () => {
  return (
    <div className='flex items-center space-x-2'>
      <div className='size-4 animate-pulse rounded-full bg-gradient-to-r from-gray-400 to-gray-600'></div>
      <div className='size-4 animate-pulse rounded-full bg-gradient-to-r from-gray-400 to-gray-600 delay-75'></div>
      <div className='size-4 animate-pulse rounded-full bg-gradient-to-r from-gray-400 to-gray-600 delay-150'></div>
    </div>
  );
};

export default TypingAnimation;
