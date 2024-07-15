// notificationProvider.tsx
'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { Howl, Howler } from 'howler';

Howler.autoUnlock = true;

const NotificationContext = createContext<{
  playNotificationSound: () => void;
}>({
  playNotificationSound: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notificationSound = new Howl({
    src: ['/audio/NotificationC.mp3'],
    html5: true,
    loop: false,
    preload: true,
  });

  useEffect(() => {
    // Preload the sound
    notificationSound.load();
  }, [notificationSound]);

  const playNotificationSound = () => {
    Howler.stop();
    notificationSound.play();
  };

  return (
    <NotificationContext.Provider value={{ playNotificationSound }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
