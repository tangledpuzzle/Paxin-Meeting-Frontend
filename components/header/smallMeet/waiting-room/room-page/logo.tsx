import React from 'react';
import Image from 'next/image';
import useLogo from '@/helpers/hooks/useLogo';

const Logo = () => {
  const logo = useLogo('waiting-room');

  return (
    <div className='waiting-room-logo'>
      <Image 
        className='waiting-room-logo-img' 
        src={logo} 
        alt='logo' 
        width={100} 
        height={100}
      />
    </div>
  );
};

export default Logo;
