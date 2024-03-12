import React, { useMemo } from 'react';

import { useAppSelector } from '@/store/hook';
import { activeSpeakersSelector } from '@/store/slices/activeSpeakersSlice';
import { participantsSelector } from '@/store/slices/participantSlice';
import SpeakerComponent from './speaker';

const ActiveSpeakers = () => {
  const activeSpeakers = useAppSelector(activeSpeakersSelector.selectAll);
  const participantIds = useAppSelector(participantsSelector.selectIds);

  const activeSpeakersElms = useMemo(() => {
    if (!activeSpeakers.length) {
      return null;
    }
    return activeSpeakers.map((speaker) => {
      if (participantIds.find((p) => p === String(speaker.userId))) {
        return <SpeakerComponent key={speaker.userId} speaker={speaker} />;
      }
    });
  }, [activeSpeakers, participantIds]);

  return activeSpeakersElms ? (
    <div className='active-speakers-wrap absolute top-0 z-[9999] flex w-full items-center justify-center ltr:right-8 rtl:left-8'>
      {activeSpeakersElms}
    </div>
  ) : null;
};

export default ActiveSpeakers;
