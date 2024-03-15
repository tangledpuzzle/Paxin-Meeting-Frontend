'use client';

import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { ToastContainer } from 'react-toastify';
// import Meet from '@/components/meet/app';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
const Meet = dynamic(
  async () => (await import('@/components/meet/app')).default,
  {
    ssr: false,
  }
);

type PaxMeetProps = {
  roomId: string;
};

const PaxMeet: React.FC<PaxMeetProps> = ({ roomId }) => {
  return (
    // <ReduxProvider store={store}>
    <DndProvider backend={HTML5Backend}>
      <Meet roomId={roomId} />
      <ToastContainer />
    </DndProvider>
    // </ReduxProvider>
  );
};

export default PaxMeet;
