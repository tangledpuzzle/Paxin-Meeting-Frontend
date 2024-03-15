import React, { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import {
  participantsSelector,
  updateParticipant,
} from '@/store/slices/participantSlice';
import { doRefreshWebcams } from '@/store/slices/roomSettingsSlice';

interface IPinWebcamProps {
  userId: string;
}

const PinWebcam = ({ userId }: IPinWebcamProps) => {
  const dispatch = useAppDispatch();
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, userId)
  );

  const togglePin = () => {
    dispatch(
      updateParticipant({
        id: userId,
        changes: {
          pinWebcam: !participant?.pinWebcam,
        },
      })
    );
    dispatch(doRefreshWebcams());
  };

  const render = useMemo(() => {
    return (
      <div className='pin-webcam cursor-pointer' onClick={togglePin}>
        {participant?.pinWebcam ? (
          <i className='pnm-pin text-[12px] text-white' />
        ) : (
          <i className='pnm-pin -rotate-90 text-[12px] text-white' />
        )}
      </div>
    );
    //eslint-disable-next-line
  }, [participant?.pinWebcam]);

  return <>{render}</>;
};

export default PinWebcam;
