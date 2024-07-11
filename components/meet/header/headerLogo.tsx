import React from 'react';
import useLogo from '@/helpers/hooks/useLogo';
import Image from 'next/image';

const HeaderLogo = () => {
  const logo = useLogo();

  return (
    <div className='header-logo'>
      <a href={`${(window as any).PAXINTRADE_URL}/profile/dashboard`}>
        <Image
          className='header-logo-img'
          src={`${logo}`}
          alt='logo'
          width={100} // Replace with your desired width
          height={100} // Replace with your desired height
        />
      </a>
    </div>
  );
};

export default HeaderLogo;
