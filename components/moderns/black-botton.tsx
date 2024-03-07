import React from 'react';
import '@/styles/glowblack.css';
import { useTheme } from 'next-themes';
import { IoFilterSharp } from 'react-icons/io5';

interface GlowingButtonProps {
  buttonText: string;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ buttonText }) => {
  const { theme } = useTheme();

  return (
    <div>
      <div className={`glowing-wrapper glowing-wrapper-ligth absolute mt-0 h-[30px]`}>
        <div className='glowing-wrapper-animations'>
          <div className='glowing-wrapper-glow'></div>
          <div className='glowing-wrapper-mask-wrapper'>
            <div className='glowing-wrapper-mask'></div>
          </div>
        </div>
        <div className='glowing-wrapper-borders-masker'>
          <div className='glowing-wrapper-borders'></div>
        </div>
        <div className='glowing-wrapper-button w-inline-block'>
          <div className='flex text-white md:pr-0 relative -top-[5px]'>
            <IoFilterSharp className='relative top-[2px]'/>
            {buttonText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlowingButton;
