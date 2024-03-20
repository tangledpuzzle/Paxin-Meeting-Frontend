'use client';

import {
  Room,
  Track,
  RoomEvent,
  LocalAudioTrack,
  TrackProcessor,
} from 'livekit-client';
import { ReactNode, useEffect, useState } from 'react';
// import MeetHeader from '@/components/meet/newHeader';

type Props = {
  children: ReactNode;
  params: { locale: string };
};

export default function ProfilePageLayout({
  children,
  params: { locale },
}: Props) {
  const [room, setRoom] = useState<Room | null>(null);

  useEffect(() => {
    // This ensures the code runs client-side
    const initRoomAndFilter = async () => {
      const room = new Room();
      // Your room setup code here...

      // Dynamically import the krisp noise filter
      const { KrispNoiseFilter, isKrispNoiseFilterSupported } = await import(
        '@livekit/krisp-noise-filter'
      );

      room.on(RoomEvent.LocalTrackPublished, async (trackPublication) => {
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

      setRoom(room);
    };

    initRoomAndFilter();

    return () => {
      // Cleanup, e.g., leave room, stop processing, etc.
      if (room) {
        room.disconnect();
      }
    };
  }, []);

  return <div>{children}</div>;
}
