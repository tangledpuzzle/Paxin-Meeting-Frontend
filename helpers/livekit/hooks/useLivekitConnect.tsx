'use client';
import { useState } from 'react';

import { IErrorPageProps } from '@/components/meet/extra-pages/Error';
import ConnectLivekit from '../ConnectLivekit';
import { IConnectLivekit } from '../types';
import { LocalAudioTrack, RoomEvent, Track } from 'livekit-client';

export interface LivekitInfo {
  livekit_host: string;
  token: string;
  enabledE2EE: boolean;
}

export interface IUseLivekitConnect {
  error: IErrorPageProps | undefined;
  setError: React.Dispatch<React.SetStateAction<IErrorPageProps | undefined>>;
  roomConnectionStatus: string;
  setRoomConnectionStatus: React.Dispatch<React.SetStateAction<string>>;
  startLivekitConnection(
    info: LivekitInfo,
    intl: (...e: any[]) => string
  ): Promise<IConnectLivekit>;
}

const useLivekitConnect = (): IUseLivekitConnect => {
  const [error, setError] = useState<IErrorPageProps | undefined>();
  const [roomConnectionStatus, setRoomConnectionStatus] =
    useState<string>('loading');

  const startLivekitConnection = async (
    info: LivekitInfo,
    intl: (...e: any[]) => string
  ): Promise<IConnectLivekit> => {
    const livekit: IConnectLivekit = new ConnectLivekit(info, setError, setRoomConnectionStatus, intl);

    const { KrispNoiseFilter, isKrispNoiseFilterSupported } = await import(
      '@livekit/krisp-noise-filter'
    );

    livekit.room.on(RoomEvent.LocalTrackPublished, async (trackPublication) => {
      if (
        trackPublication.source === Track.Source.Microphone &&
        trackPublication.track instanceof LocalAudioTrack
      ) {
        if (!isKrispNoiseFilterSupported()) {
          console.warn(
            'Enhanced noise filter is currently not supported on this browser'
          );
          return;
        }
        // Once instantiated the filter will begin initializing and will download additional resources
        const krispProcessor = KrispNoiseFilter();
        console.log('Enabling LiveKit enhanced noise filter');
        await trackPublication.track.setProcessor(krispProcessor as any);

        // Once you want to stop the Krisp processor, simply call
        // await trackPublication.track.stopProcessor()
      }
    });
    
    return livekit
  };

  return {
    error,
    setError,
    roomConnectionStatus,
    setRoomConnectionStatus,
    startLivekitConnection,
  };
};

export default useLivekitConnect;
