'use client';
import { LiveKitRoom } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import Chat from './host-chat';
import ProductPanel, { IProduct } from './product-panel';
import ChannelInfo from '@/components/stream/channel-info';
import StreamPlayerWrapper from '@/components/stream/stream-wrapper';
import { getOrCreateToken } from '@/utils/tokenHelper';

interface WatchChannelProps {
  slug: string;
  publisherId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  products: IProduct[];
}

export default function WatchChannel({
  slug,
  userId,
  publisherId,
  userName,
  products,
  userAvatar,
}: WatchChannelProps) {
  const [viewerToken, setViewerToken] = useState('');

  useEffect(() => {
    const SESSION_VIEWER_TOKEN_KEY = `${slug}-viewer-token`;
    getOrCreateToken(slug, userId, userAvatar, userName, SESSION_VIEWER_TOKEN_KEY).then(setViewerToken);
  }, [slug, userId, userAvatar, userName]);

  useEffect(() => {
    localStorage.setItem('latest-stream-id', slug);
  }, [slug]);

  if (!viewerToken || !userName) {
    return null;
  }

  return (
    <LiveKitRoom
      token={viewerToken}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className='relative flex h-[calc(100vh-81px)] flex-col'
    >
      <div className='relative h-full w-full flex'>
        <div className='flex-1'>
          <StreamPlayerWrapper streamerIdentity={publisherId} />
        </div>
        <div className='w-[30%] md:block hidden'>
          <div className='grid grid-row-1 h-full absolute md:relative'>
            <div className='px-4'>
              <ChannelInfo streamerIdentity={userId} viewerIdentity={userName} />
              <ProductPanel products={products} />
            </div>
            <div className='' style={{ maxHeight: '430px' }}>
              <Chat participantName={userId} />
            </div>
          </div>
        </div>
        <div className='block md:hidden absolute w-full' style={{ height: '-webkit-fill-available' }}>
          <div className='grid grid-row-1 h-full absolute md:relative w-full px-4' style={{ background: 'rgb(0 0 0 / 37%)' }}>
            <div className='mt-4'>
              <ProductPanel products={products} />
              <ChannelInfo streamerIdentity={userId} viewerIdentity={userName} />
            </div>
            <div className='' style={{ maxHeight: '620px' }}>
              <Chat participantName={userId} />
            </div>
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
