'use client';
import React, { useEffect } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@/store';
import Meet from '@/components/meet/app';
import 'react-toastify/dist/ReactToastify.css';
export default function PaxMeet() {
  useEffect(() => {
    console.log('Did Mount');
    return () => console.log('Unmount');
  }, []);
  return (
    <ReduxProvider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Meet />
        <ToastContainer />
      </DndProvider>
    </ReduxProvider>
  );
}
