import React from 'react';
import { Room } from 'livekit-client';

import ChatComponent from '../chat';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
import { useAppDispatch } from '@/store/hook';

interface IRightPanelProps {
  currentRoom: Room;
  isRecorder: boolean;
}

const RightPanel = ({ currentRoom, isRecorder }: IRightPanelProps) => {
  const dispatch = useAppDispatch();

  const closePanel = () => {
    dispatch(updateIsActiveChatPanel(false));
  };

  return (
    <div id='main-right-panel' className='h-[calc(100%)]'>
      {!isRecorder ? (
        <div
          className='close absolute left-[-14px] top-1 z-20 hidden size-6 cursor-pointer rounded-full border border-solid border-primaryColor bg-white dark:border-darkText dark:bg-darkSecondary md:inline-block'
          onClick={closePanel}
        >
          <span className='absolute left-[2px] top-[11px] inline-block h-[1px] w-[18px] rotate-45 bg-primaryColor dark:bg-darkText'></span>
          <span className='absolute right-[2px] top-[11px] inline-block h-[1px] w-[18px] -rotate-45 bg-primaryColor dark:bg-darkText'></span>
        </div>
      ) : null}
      <ChatComponent currentRoom={currentRoom} isRecorder={isRecorder} />
    </div>
  );
};

export default React.memo(RightPanel);
