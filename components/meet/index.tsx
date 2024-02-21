'use client';

import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@/store';
import Meet from '@/components/meet/app';
import 'react-toastify/dist/ReactToastify.css';

type PaxMeetProps = {
  roomId: string;
};

const PaxMeet: React.FC<PaxMeetProps> = ({ roomId }) => {
  return (
    <ReduxProvider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Meet roomId={roomId} />
        <ToastContainer />
      </DndProvider>
    </ReduxProvider>
  );
};

export default PaxMeet;
