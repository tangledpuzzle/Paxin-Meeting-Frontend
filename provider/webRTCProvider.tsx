'use client';
import { IErrorPageProps } from '@/components/meet/extra-pages/Error';
import useLivekitConnect, {
  LivekitInfo,
} from '@/helpers/livekit/hooks/useLivekitConnect';
import { IConnectLivekit } from '@/helpers/livekit/types';
import React, { ReactNode, useState } from 'react';
import { createContext } from 'react';
interface IRTCContext {
  livekitInfo: LivekitInfo | undefined;
  setLivekitInfo: (e: LivekitInfo) => void;
  currentConnection: IConnectLivekit | undefined;
  setCurrentConnection: (e: IConnectLivekit) => void;
  error: IErrorPageProps | undefined;
  setError: React.Dispatch<React.SetStateAction<IErrorPageProps | undefined>>;
  roomConnectionStatus: string;
  setRoomConnectionStatus: React.Dispatch<React.SetStateAction<string>>;
  startLivekitConnection(
    info: LivekitInfo,
    intl: (...e: any[]) => string
  ): IConnectLivekit;
}
export const RTCContext = createContext<IRTCContext>({
  livekitInfo: undefined,
  setLivekitInfo: function (e: LivekitInfo): void {
    throw new Error('Function not implemented.');
  },
  currentConnection: undefined,
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
});
type Props = {
  children: ReactNode;
};
export function RTCProvider({ children }: Props) {
  const [livekitInfo, setLivekitInfo] = useState<LivekitInfo>();
  const [currentConnection, setCurrentConnection] = useState<IConnectLivekit>();
  const {
    error,
    setError,
    roomConnectionStatus,
    setRoomConnectionStatus,
    startLivekitConnection,
  } = useLivekitConnect();
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
      }}
    >
      {children}
    </RTCContext.Provider>
  );
}
