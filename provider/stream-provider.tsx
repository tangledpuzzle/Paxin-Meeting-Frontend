'use client';
import { IErrorPageProps } from '@/components/meet/extra-pages/Error';
import useLivekitConnect, {
  LivekitInfo,
} from '@/helpers/livekit/hooks/useLivekitConnect';
import { IConnectLivekit } from '@/helpers/livekit/types';
import { clearAccessToken } from '@/helpers/utils';
import { useAppDispatch } from '@/store/hook';
import { removeSpeakers } from '@/store/slices/activeSpeakersSlice';
import { clearChatMessage } from '@/store/slices/chatMessagesSlice';
import { resetParticipant } from '@/store/slices/participantSlice';
import { resetRoomSetting } from '@/store/slices/roomSettingsSlice';
import { clearToken } from '@/store/slices/sessionSlice';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { createContext } from 'react';
import { useWindowSize } from 'react-use';

interface IPopUp {
  position: {
    x: number;
    y: number;
  };
  dimension: {
    width: number;
    height: number;
  };
}

interface IStreamContext {
  showPopup: boolean;
  togglePopup: () => void;
  popup: IPopUp;
  updateDimension: (w: number, h: number) => void;
  updatePosition: (x: number, y: number) => void;
}
export const StreamContext = createContext<IStreamContext>({

  popup: {
    position: {
      x: 0,
      y: 0,
    },
    dimension: {
      width: 0,
      height: 0,
    },
  },
  updateDimension: function (): void {
    throw new Error('Function not implemented.');
  },
  updatePosition: function (): void {
    throw new Error('Function not implemented.');
  },
  showPopup: false,
  togglePopup: function (): void {
    throw new Error('Function not implemented.');
  },
});
type Props = {
  children: ReactNode;
};
export function StreamProvider({ children }: Props) {
  const [showPopup, togglePopup] = useState<boolean>(true);
 
  const { width, height } = useWindowSize();

  const [popup, setPopUp] = useState<IPopUp>({
    dimension: {
      height: 0,
      width: 0,
    },
    position: {
      x: 0,
      y: 0,
    },
  });
  

  const dispatch = useAppDispatch();
 
  useEffect(() => {
    const isMobile = width > 450 ? false : true;
    setPopUp({
      dimension: {
        width: !isMobile ? 350 : 200,
        height: !isMobile ? 350 : 200,
      },
      position: {
        x: !isMobile ? width - 350 : width - 200,
        y: !isMobile ? height - 350 : height - 200,
      },
    });
  }, [width]);
  return (
    <StreamContext.Provider
      value={{
        popup,
        updateDimension: (w: number, h: number) =>
          setPopUp((e) => ({ ...e, dimension: { width: w, height: h } })),
        updatePosition: (x: number, y: number) =>
          setPopUp((e) => ({ ...e, position: { x, y } })),
        showPopup,
        togglePopup: () => togglePopup((e) => !e),
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}
