import React, { useRef } from 'react';
import { LiveKitRoom } from '@livekit/components-react';
import { useSession } from 'next-auth/react';
import HostControls from '@/components/header/smallTrade/hostcontrols';

type SmallHostProps = {
  token: string;
  roomId: string; // Assuming roomId is a string. Adjust the type if necessary.
};

export default function SmallHost({ token, roomId }: SmallHostProps) {
  const { data } = useSession();
  const previewVideoEl = useRef<HTMLVideoElement>(null);
  const viewerIdentity = data?.user?.name || '';

  return (
    <LiveKitRoom
      token={token}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className='relative flex h-[calc(100vh-81px)] flex-col'
    >
      <HostControls slug={roomId} viewerIdentity={viewerIdentity} />
      {/* <div className='aspect-video flex-1 rounded-sm border bg-neutral-200 dark:bg-neutral-800 '>
        <video
          ref={previewVideoEl}
          className='h-full'
          width='100%'
          height='100%'
        />
      </div> */}
    </LiveKitRoom>
  );
}
