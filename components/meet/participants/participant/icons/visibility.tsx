import React, { useMemo } from 'react';
import { useAppSelector } from '@/store/hook';
import { participantsSelector } from '@/store/slices/participantSlice';

interface VisibilityIconProps {
  userId: string;
}

const VisibilityIcon = ({ userId }: VisibilityIconProps) => {
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, userId)
  );

  const render = useMemo(() => {
    if (participant?.visibility === 'hidden') {
      return (
        <div className='visibility mt-[2px] cursor-pointer ltr:mr-2 rtl:ml-2'>
          <i className='pnm-eye-slash secondaryColor text-xs' />
        </div>
      );
    }

    return null;
  }, [participant?.visibility]);

  return <>{render}</>;
};

export default VisibilityIcon;
