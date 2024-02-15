'use client';
// import { SiteHeader } from '@/components/header/site-header';
// import Sidebar from '@/components/profiles/sidebar';
import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Provider as ReduxProvider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { store } from '@/store';
import Meet from '@/components/meet/app';
// type Props = {
//   children: ReactNode;
//   params: { locale: string };
// };

export default function ProfilePageLayout() {
  return (
    <ReduxProvider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Meet />
        <ToastContainer />
      </DndProvider>
    </ReduxProvider>
  );
}
