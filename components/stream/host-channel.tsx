'use client';

import { createStreamerToken } from '@/app/[locale]/(protected)/stream/action';
import { LiveKitRoom } from '@livekit/components-react';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Chat from './host-chat';
import HostControls from './host-controls';
import ProductPanel from './product-panel';

export default function HostChannel({ slug }: { slug: string }) {
  const [streamerToken, setStreamerToken] = useState('');

  // NOTE: This is a hack to persist the streamer token in the session storage
  // so that the client doesn't have to create a streamer token every time they
  // navigate back to the page.
  useEffect(() => {
    const getOrCreateStreamerToken = async () => {
      const SESSION_STREAMER_TOKEN_KEY = `${slug}-streamer-token`;
      const sessionToken = sessionStorage.getItem(SESSION_STREAMER_TOKEN_KEY);

      if (sessionToken) {
        const payload = jwtDecode(sessionToken);

        if (payload.exp) {
          const expiry = new Date(payload.exp * 1000);
          if (expiry < new Date()) {
            sessionStorage.removeItem(SESSION_STREAMER_TOKEN_KEY);
            const token = await createStreamerToken(slug);
            setStreamerToken(token);
            sessionStorage.setItem(SESSION_STREAMER_TOKEN_KEY, token);
            return;
          }
        }

        setStreamerToken(sessionToken);
      } else {
        const token = await createStreamerToken(slug);
        setStreamerToken(token);
        sessionStorage.setItem(SESSION_STREAMER_TOKEN_KEY, token);
      }
    };
    void getOrCreateStreamerToken();
  }, [slug]);

  return (
    <LiveKitRoom
      token={streamerToken}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className='relative flex h-[calc(100vh-81px)] flex-col'
    >
      <div className='relative h-full w-full  md:absolute md:h-full '>
        <div className='mx-auto my-auto w-[calc(100vw)] p-8 md:w-[calc(40vw)]'>
          <HostControls slug={slug} />
        </div>
      </div>
      <div className='flex h-full w-full justify-between md:h-full rtl:flex-row-reverse'>
        <div className='relative w-[calc(50%)] border-r md:block md:w-[calc(30vw)]'>
          <div className='absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2'>
            <ProductPanel />
            {/* <Chat participantName={slug} /> */}
          </div>
        </div>
        <div className=' relative w-[calc(50%)]  border-l  md:block md:w-[calc(30vw)]'>
          <div className='absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2'>
            <Chat participantName={slug} />
          </div>
        </div>
      </div>
    </LiveKitRoom>
  );
}
