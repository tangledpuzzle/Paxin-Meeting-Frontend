import HostControls from '@/components/stream/host-controls';
import { LiveKitRoom } from '@livekit/components-react';
import { useSession } from 'next-auth/react';
import React, { useRef } from 'react';

export default function SmallHost({
    token, roomId
}) {
    const { data } = useSession();
    const previewVideoEl = useRef<HTMLVideoElement>(null);
    return (<LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
        className='relative flex h-[calc(100vh-81px)] flex-col'
    >
        <div className='aspect-video flex-1 rounded-sm border bg-neutral-200 dark:bg-neutral-800 '>
            <video
            ref={previewVideoEl}
            className='h-full'
            width='100%'
            height='100%'
            />
        </div>
    </LiveKitRoom>);

}