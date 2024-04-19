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

  return (
    <div id='main-right-panel' className='h-[calc(100%)] w-[50vw] md:w-[33vw]'>
      <ChatComponent currentRoom={currentRoom} isRecorder={isRecorder} />
    </div>
  );
};

export default React.memo(RightPanel);
