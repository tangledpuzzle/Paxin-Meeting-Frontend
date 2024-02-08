import React from 'react';
import useLogo from '../../helpers/hooks/useLogo';

const HeaderLogo = () => {
  const logo = useLogo();

  return (
    <div className="header-logo">
      <a href={`${(window as any).PAXINTRADE_URL}/profile/dashboard`}>
        <img className="header-logo-img" src={`${logo}`} alt="logo" />
      </a>
    </div>
  );
};

export default HeaderLogo;
