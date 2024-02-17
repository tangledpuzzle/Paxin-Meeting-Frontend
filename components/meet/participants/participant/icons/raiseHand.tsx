import React, { useMemo } from 'react';
import { useAppSelector } from '@/store';
import { participantsSelector } from '@/store/slices/participantSlice';

interface IRaiseHandIconProps {
  userId: string;
}
const RaiseHandIcon = ({ userId }: IRaiseHandIconProps) => {
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, userId)
  );

  const render = useMemo(() => {
    if (participant?.metadata.raised_hand) {
      return (
        <div className='hand cursor-pointer ltr:mr-2 rtl:ml-2'>
          <i className='pnm-raise-hand text-[10px] text-[#ffbd40]' />
        </div>
      );
    } else {
      return null;
    }
  }, [participant?.metadata.raised_hand]);

  return <>{render}</>;
};

export default RaiseHandIcon;
