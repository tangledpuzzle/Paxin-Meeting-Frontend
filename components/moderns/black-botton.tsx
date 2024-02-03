import React from 'react';
import '@/styles/glowblack.css';
import { useTheme } from 'next-themes';

interface GlowingButtonProps {
  buttonText: string;
}


const GlowingButton: React.FC<GlowingButtonProps> = ({ buttonText }) => {
  const { theme } = useTheme();

  return (
    <div>
    <div className={`glowing-wrapper mt-0 ${theme === 'dark' ? 'glowing-wrapper-active' : 'glowing-wrapper-ligth'}`}>
      <div className="glowing-wrapper-animations">
        <div className="glowing-wrapper-glow"></div>
        <div className="glowing-wrapper-mask-wrapper">
          <div className="glowing-wrapper-mask"></div>
        </div>
      </div>
      <div className="glowing-wrapper-borders-masker">
        <div className="glowing-wrapper-borders"></div>
      </div>
      <div className="glowing-wrapper-button w-inline-block">
        <div className="text-white">{buttonText}</div>
      </div>
    </div>
    </div>
    
  );
};

export default GlowingButton;