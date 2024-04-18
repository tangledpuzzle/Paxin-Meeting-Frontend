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
      <ChatComponent currentRoom={currentRoom} isRecorder={isRecorder} />
    </div>
  );
};

export default React.memo(RightPanel);
