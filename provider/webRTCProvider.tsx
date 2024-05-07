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

interface IRTCContext {
  showPopup: boolean;
  togglePopup: () => void;
  livekitInfo: LivekitInfo | null;
  setLivekitInfo: (e: LivekitInfo) => void;
  currentConnection: IConnectLivekit | null;
  setCurrentConnection: (e: IConnectLivekit) => void;
  error: IErrorPageProps | undefined;
  setError: React.Dispatch<React.SetStateAction<IErrorPageProps | undefined>>;
  roomConnectionStatus: string;
  setRoomConnectionStatus: React.Dispatch<React.SetStateAction<string>>;
  startLivekitConnection(
    info: LivekitInfo,
    intl: (...e: any[]) => string
  ): IConnectLivekit;
  clearSession: () => void;
  popup: IPopUp;
  updateDimension: (w: number, h: number) => void;
  updatePosition: (x: number, y: number) => void;
}
export const RTCContext = createContext<IRTCContext>({
  livekitInfo: null,
  setLivekitInfo: function (e: LivekitInfo): void {
    throw new Error('Function not implemented.');
  },
  currentConnection: null,
  setCurrentConnection: function (e: IConnectLivekit): void {
    throw new Error('Function not implemented.');
  },
  error: undefined,
  setError: function (
    value: React.SetStateAction<IErrorPageProps | undefined>
  ): void {
    throw new Error('Function not implemented.');
  },
  roomConnectionStatus: '',
  setRoomConnectionStatus: function (
    value: React.SetStateAction<string>
  ): void {
    throw new Error('Function not implemented.');
  },
  startLivekitConnection: function (
    info: LivekitInfo,
    intl: (...e: any[]) => string
  ): IConnectLivekit {
    throw new Error('Function not implemented.');
  },
  clearSession: () => {},
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
export function RTCProvider({ children }: Props) {
  const [showPopup, togglePopup] = useState<boolean>(true);
  const [livekitInfo, setLivekitInfo] = useState<LivekitInfo | null>(null);
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
  const [currentConnection, setCurrentConnection] =
    useState<IConnectLivekit | null>(null);
  const {
    error,
    setError,
    roomConnectionStatus,
    setRoomConnectionStatus,
    startLivekitConnection,
  } = useLivekitConnect();
  const dispatch = useAppDispatch();
  const clearSession = useCallback(async () => {
    clearAccessToken();
    dispatch(resetParticipant());
    dispatch(clearToken());
    dispatch(clearChatMessage());
    dispatch(resetRoomSetting());
    dispatch(removeSpeakers());
    if (currentConnection) {
      console.log('CLEAR SESSION');
      setLivekitInfo(null);
      setCurrentConnection(null);
      await currentConnection.room.disconnect();
    }
  }, [currentConnection]);
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
    <RTCContext.Provider
      value={{
        livekitInfo,
        setLivekitInfo,
        currentConnection,
        setCurrentConnection,
        error,
        setError,
        roomConnectionStatus,
        setRoomConnectionStatus,
        startLivekitConnection,
        clearSession,
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
    </RTCContext.Provider>
  );
}
