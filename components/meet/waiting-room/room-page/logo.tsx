import React from 'react';
import useLogo from '@/helpers/hooks/useLogo';
import Image from 'next/image';

const Logo = () => {
  const logo = useLogo('waiting-room');

  return (
    <div className='waiting-room-logo'>
      <Image className='waiting-room-logo-img' src={`${logo}`} alt='logo' layout='fill' />
    </div>
  );
};

export default Logo;
