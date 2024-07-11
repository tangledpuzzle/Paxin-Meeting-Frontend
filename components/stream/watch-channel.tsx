// 'use client';

// import { createViewerToken } from '@/app/[locale]/(protected)/stream/action';
// import ChannelInfo from '@/components/stream/channel-info';
// import StreamPlayer from '@/components/stream/stream-player';
// // import WatchingAsBar from '@/components/stream/watching-as-bar';

// import { LiveKitRoom } from '@livekit/components-react';
// import { jwtDecode, type JwtPayload } from 'jwt-decode';
// import React, { useEffect, useState } from 'react';
// import Chat from './host-chat';
// import ProductPanel, { IProduct } from './product-panel';
// import apiHelper from '@/helpers/api/apiRequest';
// interface WatchChannelProps {
//   slug: string;
//   publisherId: string;
//   userId: string;
//   userName: string;
//   userAvatar: string;
//   products: IProduct[];
// }
// export default function WatchChannel({
//   slug,
//   userId,
//   publisherId,
//   userName,
//   products,
//   userAvatar,
// }: WatchChannelProps) {
//   const [viewerToken, setViewerToken] = useState('');
//   // NOTE: This is a hack to persist the viewer token in the session storage
//   // so that the client doesn't have to create a viewer token every time they
//   // navigate back to the page.
//   useEffect(() => {
//     async function getToken(slug: string) {
//       const response = await apiHelper({
//         url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + `room/join/${slug}`,
//         method:'POST',
//         data:{
//           userId,
//           photo: userAvatar,
//           userName
//         }
//       });

//       return response.data.token;
//     }
//     const getOrCreateViewerToken = async () => {
//       const SESSION_VIEWER_TOKEN_KEY = `${slug}-viewer-token`;
//       const sessionToken = localStorage.getItem(SESSION_VIEWER_TOKEN_KEY);

//       if (sessionToken) {
//         const payload: JwtPayload = jwtDecode(sessionToken);
//         console.log(payload)
//         if (payload.exp) {
//           const expiry = new Date(payload.exp * 1000);
//           if (expiry < new Date()) {
//             localStorage.removeItem(SESSION_VIEWER_TOKEN_KEY);
//             const token = await getToken(slug);
//             // const token = await createViewerToken(
//             //   slug,
//             //   userId,
//             //   userName,
//             //   userAvatar
//             // );
//             setViewerToken(token);
//             localStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
//             return;
//           }
//         }

//         setViewerToken(sessionToken);
//       } else {
//         const token = await getToken(slug);
//         // const token = await createViewerToken(
//         //   slug,
//         //   userId,
//         //   userName,
//         //   userAvatar
//         // );
//         setViewerToken(token);
//         localStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
//       }
//     };
//     void getOrCreateViewerToken();
//   }, [slug]);
//   useEffect(()=>{
//     localStorage.setItem('latest-stream-id', slug);
//    }, [slug]);
//   if (viewerToken === '' || userName === '') {
//     return null;
//   }
//   console.log(userName)

//   return (
//     <LiveKitRoom
//       token={viewerToken}
//       serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
//       className='relative flex h-[calc(100vh-81px)] flex-col'
//     >
//       {/* <WatchingAsBar userName={userName} /> */}

//       <div className='relative h-full w-full  md:absolute md:h-full '>
//         <div className='mx-auto my-auto flex h-full w-[calc(100vw)] flex-col p-0 md:p-0 md:w-[calc(40vw)]'>
//           <div className='flex-1'>
//             <StreamPlayer streamerIdentity={publisherId} />
//           </div>
//           <ChannelInfo streamerIdentity={userId} viewerIdentity={userName} />
//         </div>
//       </div>
//       <div className='flex h-full w-full justify-between md:h-full rtl:flex-row-reverse'>
//         <div className='relative w-[calc(50%)] border-r md:block md:w-[calc(30vw)]'>
//           <div className='absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2'>
//             <ProductPanel products={products} />
//           </div>
//         </div>
//         <div className=' relative w-[calc(50%)]  border-l  md:block md:w-[calc(30vw)]'>
//           <div className='absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2'>
//             <Chat participantName={userId} />
//           </div>
//         </div>
//       </div>
//     </LiveKitRoom>
//   );
// }

'use client';

import ChannelInfo from '@/components/stream/channel-info';
import StreamPlayer from '@/components/stream/stream-player';
// import WatchingAsBar from '@/components/stream/watching-as-bar';

import { LiveKitRoom } from '@livekit/components-react';
import { jwtDecode, type JwtPayload } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import Chat from './host-chat';
import ProductPanel, { IProduct } from './product-panel';
import apiHelper from '@/helpers/api/apiRequest';

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
    async function getToken(slug: string) {
      const response = await apiHelper({
        url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + `room/join/${slug}`,
        method: 'POST',
        data: {
          userId,
          photo: userAvatar,
          userName,
        },
      });

      return response.data.token;
    }
    const getOrCreateViewerToken = async () => {
      const SESSION_VIEWER_TOKEN_KEY = `${slug}-viewer-token`;
      const sessionToken = localStorage.getItem(SESSION_VIEWER_TOKEN_KEY);

      if (sessionToken) {
        const payload: JwtPayload = jwtDecode(sessionToken);
        console.log(payload);
        if (payload.exp) {
          const expiry = new Date(payload.exp * 1000);
          if (expiry < new Date()) {
            localStorage.removeItem(SESSION_VIEWER_TOKEN_KEY);
            const token = await getToken(slug);
            setViewerToken(token);
            localStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
            return;
          }
        }

        setViewerToken(sessionToken);
      } else {
        const token = await getToken(slug);
        setViewerToken(token);
        localStorage.setItem(SESSION_VIEWER_TOKEN_KEY, token);
      }
    };
    void getOrCreateViewerToken();
  }, [slug]);
  useEffect(() => {
    localStorage.setItem('latest-stream-id', slug);
  }, [slug]);
  if (viewerToken === '' || userName === '') {
    return null;
  }
  console.log(userName);

  return (
    <LiveKitRoom
      token={viewerToken}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className='relative flex h-[calc(100vh-81px)] flex-col'
    >
      <div className='relative flex h-full w-full'>
        <div className='flex-1'>
          <StreamPlayer streamerIdentity={publisherId} />
        </div>
        <div className='hidden w-[30%] md:block'>
          <div className='grid-row-1 absolute grid h-full md:relative'>
            <div className='px-4'>
              <ChannelInfo
                streamerIdentity={userId}
                viewerIdentity={userName}
              />
              <ProductPanel products={products} />
            </div>
            <div className='' style={{ maxHeight: '430px' }}>
              <Chat participantName={userId} />
            </div>
          </div>
        </div>
        {/* for mobile */}
        <div
          className='absolute block w-full md:hidden'
          style={{ height: '-webkit-fill-available' }}
        >
          <div
            className='grid-row-1 absolute grid h-full w-full px-4 md:relative'
            style={{ background: 'rgb(0 0 0 / 37%)' }}
          >
            <div className='mt-4'>
              <ProductPanel products={products} />
              <ChannelInfo
                streamerIdentity={userId}
                viewerIdentity={userName}
              />
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
