'use client';

import {
  LiveKitRoom,
  useLocalParticipant,
  useParticipants,
} from '@livekit/components-react';
import { useEffect, useState, useRef, useCallback, useContext } from 'react';
import Chat from './host-chat';
import { IProduct } from './product-panel';
import apiHelper from '@/helpers/api/apiRequest';
import { Track, createLocalTracks, LocalTrack } from 'livekit-client';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { usePaxContext, PaxContext } from '@/context/context';
import { Loader2 } from 'lucide-react';

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
  products,
}: HostChannelProps) {
  const [streamerToken, setStreamerToken] = useState('');
  const router = useRouter();
  const { user } = usePaxContext();
  const { lastCommand, additionalData } = useContext(PaxContext);

  useEffect(() => {
    if (lastCommand === 'newDonat' && additionalData.length > 0) {
      additionalData.forEach((data) => {
        toast.success(
          `Донат от: ${data.name}, Сумму: ${data.total}, Сообщение: ${data.msg}`,
          {
            position: 'top-right',
          }
        );
      });
    }
  }, [lastCommand, additionalData]);

  useEffect(() => {
    const getOrCreateStreamerToken = async () => {
      const SESSION_STREAMER_TOKEN_KEY = `${slug}-streamer-token`;
      const sessionToken = localStorage.getItem(SESSION_STREAMER_TOKEN_KEY);
      if (!sessionToken) {
        const response = await apiHelper({
          url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + 'room/entry',
          method: 'POST',
          data: {
            roomId: slug,
          },
        });
        const { token } = response.data;
        localStorage.setItem(`${slug}-streamer-token`, token);
        setStreamerToken(token || '');
      } else {
        setStreamerToken(sessionToken || '');
      }
    };
    void getOrCreateStreamerToken();
  }, [slug]);

  useEffect(() => {
    localStorage.setItem('latest-stream-id', slug);
  }, [slug]);

  async function sendPushNotification() {
    const pageURL = window.location.href.replace('/host', '');

    await fetch('/api/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Title: 'Пользователь ' + (user?.username || '') + ' в эфире',
        Text: 'Поток начался. Присоединяйтесь сейчас!',
        PageURL: pageURL,
      }),
    });
  }

  async function deleteTradingRoom() {
    const response = await apiHelper({
      url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + 'room/delete/' + slug,
      method: 'DELETE',
    });
    const storeRoomId: string | null = localStorage.getItem('latest-stream-id');
    if (storeRoomId !== null) {
      const tokenKey = Object.keys(localStorage).find((key) =>
        key.startsWith(storeRoomId)
      );
      if (tokenKey) localStorage.removeItem(tokenKey);
    }
    if (response == null) {
      toast.error('Ошибка');
    } else {
      toast.success('Эфир закрыт');
      router.push('/profile/posts');
    }
  }

  return (
    <LiveKitRoom
      token={streamerToken}
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL}
      className='relative flex h-[calc(100vh-81px)] flex-col'
    >
      <HostStreamManager
        userId={userId}
        sendPushNotification={sendPushNotification}
        deleteTradingRoom={deleteTradingRoom}
        products={products} // Передаем продукты здесь
      />
    </LiveKitRoom>
  );
}

interface HostStreamManagerProps {
  userId: string;
  sendPushNotification: () => Promise<void>;
  deleteTradingRoom: () => Promise<void>;
  products: IProduct[]; // Добавляем продукты в интерфейс
}

function HostStreamManager({
  userId,
  sendPushNotification,
  deleteTradingRoom,
}: HostStreamManagerProps) {
  const [videoTrack, setVideoTrack] = useState<LocalTrack>();
  const [audioTrack, setAudioTrack] = useState<LocalTrack>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [hasSentNotification, setHasSentNotification] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [isStartingStream, setIsStartingStream] = useState(false); // Loading state for start stream button
  const [isStoppingStream, setIsStoppingStream] = useState(false); // Loading state for stop stream button
  const [isClosingStream, setIsClosingStream] = useState(false); // Loading state for close stream button
  const previewVideoEl = useRef<HTMLVideoElement>(null);
  const { localParticipant } = useLocalParticipant();
  const participants = useParticipants();

  const createTracks = async () => {
    const tracks = await createLocalTracks({ audio: true, video: true });
    tracks.forEach((track) => {
      switch (track.kind) {
        case Track.Kind.Video: {
          if (previewVideoEl?.current) {
            track.attach(previewVideoEl.current);
          }
          setVideoTrack(track);
          break;
        }
        case Track.Kind.Audio: {
          setAudioTrack(track);
          break;
        }
      }
    });
  };

  useEffect(() => {
    void createTracks();
  }, []);

  useEffect(() => {
    return () => {
      videoTrack?.stop();
      audioTrack?.stop();
    };
  }, [videoTrack, audioTrack]);

  useEffect(() => {
    setParticipantCount(participants.length);
  }, [participants]);

  const togglePublishing = useCallback(async () => {
    if (isPublishing && localParticipant) {
      setIsStoppingStream(true);
      setIsUnpublishing(true);

      if (videoTrack) {
        void localParticipant.unpublishTrack(videoTrack);
      }
      if (audioTrack) {
        void localParticipant.unpublishTrack(audioTrack);
      }

      await createTracks();

      setTimeout(() => {
        setIsUnpublishing(false);
        setIsStoppingStream(false);
      }, 2000);
    } else if (localParticipant) {
      setIsStartingStream(true);

      if (videoTrack) {
        void localParticipant.publishTrack(videoTrack);
      }
      if (audioTrack) {
        void localParticipant.publishTrack(audioTrack);
      }

      if (!hasSentNotification) {
        await sendPushNotification();
        setHasSentNotification(true);
      }
      setIsStartingStream(false);
    }

    setIsPublishing((prev) => !prev);
  }, [
    audioTrack,
    isPublishing,
    localParticipant,
    videoTrack,
    sendPushNotification,
    hasSentNotification
  ]);

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='absolute top-4 z-40 flex w-full flex-col items-center justify-between md:right-[50px] md:w-[250px]'>
        <div className='mb-4 flex gap-[5px] text-lg font-bold text-white'>
          {isPublishing && !isUnpublishing ? (
            <div className='flex items-center gap-1'>
              <span className='relative mr-1 flex size-3'>
                <span className='absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75'></span>
                <span className='relative inline-flex size-3 rounded-full bg-red-500'></span>
              </span>
              (кол-во зрителей {participantCount})
            </div>
          ) : (
            'Готов к эфиру'
          )}{' '}
        </div>
        <div className='flex gap-2'>
          {isPublishing ? (
            <button
              className='md:text-md rounded bg-red-600 px-4 py-2 text-xs hover:bg-red-700'
              onClick={() => void togglePublishing()}
              disabled={isUnpublishing || isStoppingStream}
            >
              {isStoppingStream ? (
                <Loader2 className='animate-spin' />
              ) : isUnpublishing ? (
                'Останавливаем...'
              ) : (
                'Поставить паузу'
              )}
            </button>
          ) : (
            <button
              className='md:text-md animate-pulse rounded bg-primary px-4 py-2 text-xs hover:bg-blue-700'
              onClick={() => void togglePublishing()}
              disabled={isStartingStream}
            >
              {isStartingStream ? (
                <Loader2 className='animate-spin' />
              ) : (
                'Начать'
              )}
            </button>
          )}
          <button
            className='md:text-md rounded bg-red-600 px-4 py-2 text-xs hover:bg-red-700'
            onClick={async () => {
              setIsClosingStream(true); // Start loading
              await deleteTradingRoom();
              setIsClosingStream(false); // Stop loading
            }}
            disabled={isClosingStream}
          >
            {isClosingStream ? (
              <Loader2 className='animate-spin' />
            ) : (
              'Закрыть эфир'
            )}
          </button>
        </div>
      </div>
      <div className='relative flex-1 rounded-sm border bg-neutral-200 dark:bg-neutral-800'>
        <video
          ref={previewVideoEl}
          className='absolute inset-0 size-full'
          style={{ objectFit: 'cover' }}
        />
        <div className='absolute inset-0 z-10 flex size-full justify-between rtl:flex-row-reverse'>
          {/* <div className='relative w-full md:block'>
            <div className='absolute bottom-0 right-0 top-0 flex h-full w-full flex-col gap-2 p-2'>
              <ProductPanel products={products} />
            </div>
          </div> */}
          <div className='relative w-full md:block'>
            <div className='absolute inset-y-0 right-0 flex size-full flex-col gap-2 bg-black/40 p-2 pt-[120px] md:w-[340px]'>
              <Chat participantName={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
