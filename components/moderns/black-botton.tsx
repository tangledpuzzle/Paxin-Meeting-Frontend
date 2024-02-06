import React from 'react';
import '@/styles/glowblack.css';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface GlowingButtonProps {
  buttonText: string;
}

const GlowingButton: React.FC<GlowingButtonProps> = ({ buttonText }) => {
  const { theme } = useTheme();

  return (
    <div>
      <div
        className={`glowing-wrapper mt-0 ${theme === 'dark' ? 'glowing-wrapper-active' : 'glowing-wrapper-ligth'}`}
      >
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
          <div className='text-white flex pr-4 md:pr-0'>
          <Image
                src='/filter.svg'
                alt='en'
                width={24}
                height={24}
                className='mr-2 h-auto w-5'
              />
            {buttonText}</div>
        </div>
      </div>
    </div>
  );
};

export default GlowingButton;
