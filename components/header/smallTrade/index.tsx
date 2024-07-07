import CopyClipboard from '@/components/common/copy-clipboard';
import Draggable, { DraggableHandle } from '@/components/ui/draggable';
import { FullscreenIcon, Minimize2Icon, MoveIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { Resizable } from 're-resizable';
import React, { useContext, useEffect, useState } from 'react';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import { TiVideo } from 'react-icons/ti';
import { StreamContext } from '@/provider/stream-provider';
import {  useRouter } from 'next/navigation';
import SmallHost from './small-host';
import SmallWatch from './small-watch';

async function getTradingData(roomId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_PAXTRADE_API_URL}room/get/${roomId}`
    );

    if (!res.ok) {
      return null;
    }

    return res.json();
  } catch (error) {
    return null;
  }
}

export default function SmallTrade() {
  const { showPopup, togglePopup, popup, updateDimension, updatePosition } =
    useContext(StreamContext);

  const [isHost, setIsHost] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [publisher, setPublisher] = useState<string>('');
  const isMobile = false;
  const [roomId, setRoomid] = useState('');
  const router = useRouter();
  const [streamUrl, setStreamUrl] = useState('');
  const closepopup = () => {
    const storeRoomId: string | null = localStorage.getItem('latest-stream-id');
    if (storeRoomId !== null) {
      const tokenKey = Object.keys(localStorage).find((key) =>
        key.startsWith(storeRoomId)
      );
      if (tokenKey) localStorage.removeItem(tokenKey);
    }
    router.push('/chat');
  };
  // const roomId =  localStorage.getItem('latest-stream-id');
  useEffect(() => {
    console.log('did mount');
    const storeRoomId = localStorage.getItem('latest-stream-id');
    setRoomid(storeRoomId || '');
    return () => console.log('clear mount');
  }, []);
  useEffect(() => {
    if (roomId !== null && roomId !== '') {
      // Get viewer/streamerToken;
      const tokenKey = Object.keys(localStorage).find((key) =>
        key.startsWith(roomId)
      );
      if (tokenKey) {
        const foundToken = localStorage.getItem(tokenKey);
        console.log('asssssa', foundToken, tokenKey);
        if (tokenKey.split('-')[1] === 'streamer') setIsHost(true);
        else setIsHost(false);
        if (tokenKey.split('-')[1] === 'streamer')
          setStreamUrl(`/stream/${roomId}/host`);
        else setStreamUrl(`/stream/${roomId}`);
        setToken(foundToken || '');
      }
    }
  }, [roomId]);
  useEffect(() => {
    const fetchTradingData = async () => {
      if (token !== '') {
        try {
          const tradingData = await getTradingData(roomId);
          if (tradingData && tradingData.data && tradingData.data.publisher) {
            setPublisher(tradingData.data.publisher.userID);
            console.log(tradingData.data.publisher.userID);
          }
          console.log(streamUrl);
        } catch (error) {
          console.error('Error fetching trading data:', error);
        }
      }
    };

    fetchTradingData();
    console.log(publisher);
  }, [token, roomId]);
  return token !== '' ? (
    <>
      <button onClick={togglePopup}>
        <div className='flex items-center justify-center'>
          <span className='relative -top-2 left-12 rounded-full bg-card-gradient-menu px-2 text-center text-xs'>
            {1}
          </span>
          <TiVideo size={32} />
        </div>
      </button>

      {/* <Meet currentConnection={currentConnection} />; */}
      {showPopup && (
        <>
          {/* @ts-expect-error: no sms */}
          <Draggable
            axis='both'
            onStop={(e: DraggableEvent, d: DraggableData) => {
              updatePosition(d.x, d.y);
            }}
            header='handle1'
            handle='.handle1'
            defaultClassName='fixed left-0 top-0 bg-white border-gray-500  shadow-md'
            defaultPosition={{ x: -20, y: 436 }}
            // defaultPosition={popup.position}
            //   position={null}
            scale={1}
          >
            <Resizable
              onResizeStop={(a, b, c, e) => {
                const newWidth = popup.dimension.width + e.width;
                const newHeight = popup.dimension.height + e.height;
                const maxWidth = !isMobile ? 350 : 200;
                const maxHeight = !isMobile ? 350 : 200;

                updateDimension(
                  newWidth > maxWidth ? newWidth : maxWidth,
                  newHeight > maxHeight ? newHeight : maxHeight
                );
              }}
              // size={popup.dimension}
              minWidth={!isMobile ? 350 : 200}
              minHeight={!isMobile ? 350 : 200}
              defaultSize={popup.dimension}
            >
              <div className='flex h-full w-full flex-col rounded-2xl shadow-sky-50 dark:bg-darkPrimary'>
                <div className='bg-h flex justify-between px-2 pt-2'>
                  <div className='flex w-full justify-center'>
                    {!isMobile && <p>{roomId}</p>}
                    <CopyClipboard
                      text={`https://www.myru.online/meet/${roomId}`}
                    >
                      <div className='notepad my-auto inline-block h-8 w-8 items-center justify-center rounded-full px-2 py-1'>
                        <i className='pnm-notepad h-4 w-4 text-primaryColor dark:text-secondaryColor' />
                      </div>
                    </CopyClipboard>
                  </div>
                  <div className='flex items-center'>
                    <DraggableHandle>
                      <MoveIcon size={isMobile ? 24 : 32} />
                    </DraggableHandle>
                    <Link href={streamUrl}>
                      <FullscreenIcon size={isMobile ? 24 : 32} />
                    </Link>
                    <Minimize2Icon
                      size={isMobile ? 24 : 32}
                      onClick={togglePopup}
                    />
                    <XIcon size={isMobile ? 24 : 32} onClick={closepopup} />
                  </div>
                </div>

                <div className='border-gardient-h relative w-full' />
                {isHost ? (
                  <SmallHost token={token} roomId={roomId} />
                ) : (
                  <SmallWatch roomId={roomId} token={token} />
                )}

                {/* {currentConnection && (
                  <div className='flex h-full flex-col justify-between'>
                    <Meet currentConnection={currentConnection} />
                    <Footer
                      isMobile={isMobile}
                      currentRoom={currentConnection.room}
                      isRecorder={
                        currentConnection?.room.localParticipant.identity ===
                          'RECORDER_BOT' ||
                        currentConnection?.room.localParticipant.identity ===
                          'RTMP_BOT'
                          ? true
                          : false
                      }
                    />
                    <AudioNotification /> 
                  </div>
                )} */}
              </div>
            </Resizable>
          </Draggable>
        </>
      )}
    </>
  ) : null;
}
