'use client';
import { IErrorPageProps } from '@/components/meet/extra-pages/Error';
import useLivekitConnect, {
  LivekitInfo,
} from '@/helpers/livekit/hooks/useLivekitConnect';
import { IConnectLivekit } from '@/helpers/livekit/types';
import { clearAccessToken } from '@/helpers/utils';
import { useAppDispatch } from '@/store/hook';
import { resetParticipant } from '@/store/slices/participantSlice';
import React, { ReactNode, useState } from 'react';
import { createContext } from 'react';
interface IRTCContext {
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
});
type Props = {
  children: ReactNode;
};
export function RTCProvider({ children }: Props) {
  const [livekitInfo, setLivekitInfo] = useState<LivekitInfo | null>(null);
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
  function clearSession() {
    if (currentConnection) {
      clearAccessToken();
      dispatch(resetParticipant());
      currentConnection.room.disconnect();
      setCurrentConnection(null);
    }
  }
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
      }}
    >
      {children}
    </RTCContext.Provider>
  );
}
