import React, { useMemo } from 'react';

import { useAppSelector } from '@/store/hook';
import { participantsSelector } from '@/store/slices/participantSlice';

interface IScreenShareIconProps {
  userId: string;
}

const ScreenShareIcon = ({ userId }: IScreenShareIconProps) => {
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, userId)
  );

  const render = useMemo(() => {
    if (participant?.screenShareTrack) {
      return (
        <div className='screen-share cursor-pointer ltr:mr-2 rtl:ml-2'>
          <i className='pnm-screen-share secondaryColor text-[10px]' />
        </div>
      );
    }
    return null;
  }, [participant?.screenShareTrack]);

  return <>{render}</>;
};

export default ScreenShareIcon;
