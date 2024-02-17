import React from 'react';
import { IActiveSpeaker } from '@/store/slices/interfaces/activeSpeakers';

interface ISpeakerProps {
  speaker: IActiveSpeaker;
}
const SpeakerComponent = ({ speaker }: ISpeakerProps) => {
  return (
    <div className='primaryColor m-1 inline-flex items-center rounded-2xl border border-solid border-white bg-white px-3 py-1 text-[12px]'>
      <i className='pnm-mic-unmute secondaryColor text-[10px] ltr:mr-2 rtl:ml-2' />
      {speaker.name}
    </div>
  );
};

export default SpeakerComponent;
