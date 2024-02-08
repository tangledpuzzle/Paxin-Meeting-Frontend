'use client';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@/store';

export default function ProfilePageLayout() {
  return (
    <ReduxProvider store={store}>
      <DndProvider backend={HTML5Backend}>
        {/* <Meet /> */}
        <ToastContainer />
      </DndProvider>
    </ReduxProvider>
  );
}
