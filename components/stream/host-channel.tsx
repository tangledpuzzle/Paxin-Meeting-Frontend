'use client';

import { createStreamerToken } from '@/app/[locale]/(protected)/stream/action';
import { LiveKitRoom } from '@livekit/components-react';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Chat from './host-chat';
import HostControls from './host-controls';
import ChannelInfo from '@/components/stream/channel-info';
import ProductPanel, { IProduct } from './product-panel';
import apiHelper from '@/helpers/api/apiRequest';
interface HostChannelProps {
  slug: string;
  userId: string;
  userName: string;
  userAvatar: string;
  products: IProduct[];
}
export default function HostChannel({
  slug,
  userId,
  userName,
  userAvatar,
  products,
}: HostChannelProps) {
  const [streamerToken, setStreamerToken] = useState('');
  console.log('hostchannel')

  // NOTE: This is a hack to persist the streamer token in the session storage
  // so that the client doesn't have to create a streamer token every time they
  // navigate back to the page.
  
  useEffect(() => {
    const getOrCreateStreamerToken = async () => {
      console.log('slug', slug)
      const SESSION_STREAMER_TOKEN_KEY = `${slug}-streamer-token`;
      const sessionToken = localStorage.getItem(SESSION_STREAMER_TOKEN_KEY);
      console.log(sessionToken)
      if(!sessionToken){
        console.log('no', slug)
        const response = await apiHelper({
          url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + 'room/entry',
          method: 'POST',
          data: {
            roomId: slug
          },
        });
        console.log('token', response)
        const { token } = response.data;
        console.log('11111111111', token)
        localStorage.setItem(`${slug}-streamer-token`, token);
        setStreamerToken(token || '')
      }
      setStreamerToken(sessionToken || '')
      // const payload: JwtPayload = jwtDecode(sessionToken || '');
      //   console.log(payload)
    };
    void getOrCreateStreamerToken();
  }, [slug]);

  useEffect(()=>{
    localStorage.setItem('latest-stream-id', slug);
   }, [slug]);

  return (
    <LiveKitRoom
      token={streamerToken}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className='relative flex h-[calc(100vh-81px)] flex-col'
    >
      <div className='relative h-full w-full  md:absolute md:h-full '>
        <div className='mx-auto my-auto h-full w-[calc(100vw)] p-8 md:w-[calc(40vw)]'>
          <HostControls slug={slug} viewerIdentity={userId} />
        </div>
      </div>
      <div className='flex h-full w-full justify-between md:h-full rtl:flex-row-reverse'>
        <div className='relative w-[calc(50%)] border-r md:block md:w-[calc(30vw)]'>
          <div className='absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2'>
            <ProductPanel products={products} />
            {/* <Chat participantName={slug} /> */}
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
