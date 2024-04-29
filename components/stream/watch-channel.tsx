'use client';

// import { createViewerToken } from '@/app/[locale]/(protected)/stream/action';
import ChannelInfo from '@/components/stream/channel-info';
import StreamPlayer from '@/components/stream/stream-player';
import WatchingAsBar from '@/components/stream/watching-as-bar';
import { faker } from '@faker-js/faker';
import { LiveKitRoom } from '@livekit/components-react';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { useEffect, useMemo, useState } from 'react';
import Chat from './host-chat';
import ProductPanel from './product-panel';
interface WatchChannelProps {
  slug: string;
  products: object[];
  publisherId: string;
  userId: string;
  userName: string;
  userAvatar: string;
}
export default function WatchChannel({
  slug,
  userId,
  userName,
  userAvatar,
}: WatchChannelProps) {
  const [viewerToken, setViewerToken] = useState('');

  const fakeName = useMemo(() => faker.person.fullName(), []);

  // NOTE: This is a hack to persist the viewer token in the session storage
  // so that the client doesn't have to create a viewer token every time they
  // navigate back to the page.
  useEffect(() => {
    const getOrCreateViewerToken = async () => {
      const SESSION_VIEWER_TOKEN_KEY = `${slug}-viewer-token`;
      const sessionToken = localStorage.getItem(SESSION_VIEWER_TOKEN_KEY);

      if (sessionToken) {
        const payload: JwtPayload = jwtDecode(sessionToken);

        if (payload.exp) {
          const expiry = new Date(payload.exp * 1000);
          if (expiry < new Date()) {
            localStorage.removeItem(SESSION_VIEWER_TOKEN_KEY);

            // const token = await createViewerToken(
            //   slug,
            //   userId,
            //   userName,
            //   userAvatar
            // );
            // setViewerToken(token);
            // localStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
            return;
          }
        }

        setViewerToken(sessionToken);
      } else {
        // const token = await createViewerToken(
        //   slug,
        //   userId,
        //   userName,
        //   userAvatar
        // );
        // setViewerToken(token);
        // sessionStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
      }
    };
    void getOrCreateViewerToken();
  }, [fakeName, slug]);

  if (viewerToken === '' || userName === '') {
    return null;
  }

  return (
    <LiveKitRoom
      token={viewerToken}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className='relative flex h-[calc(100vh-81px)] flex-col'
    >
      {/* <WatchingAsBar userName={userName} /> */}

      <div className='relative h-full w-full  md:absolute md:h-full '>
        <div className='mx-auto my-auto flex h-full w-[calc(100vw)] flex-col p-8 md:w-[calc(40vw)]'>
          <div className='flex-1'>
            <StreamPlayer streamerIdentity={slug} />
          </div>
          <ChannelInfo streamerIdentity={userId} viewerIdentity={userName} />
        </div>
      </div>
      <div className='flex h-full w-full justify-between md:h-full rtl:flex-row-reverse'>
        <div className='relative w-[calc(50%)] border-r md:block md:w-[calc(30vw)]'>
          <div className='absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2'>
            <ProductPanel />
          </div>
        </div>
        <div className=' relative w-[calc(50%)]  border-l  md:block md:w-[calc(30vw)]'>
          <div className='absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2'>
            <Chat participantName={userId} />
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
