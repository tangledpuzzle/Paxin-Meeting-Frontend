import { Button } from '@/components/ui/button';
import apiHelper from '@/helpers/api/apiRequest';
import { useLocalParticipant } from '@livekit/components-react';
import { Track, createLocalTracks, type LocalTrack } from 'livekit-client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import Presence from './presence';
import { usePaxContext } from '@/context/context';
import { Loader2 } from 'lucide-react';

interface Props {
  slug: string;
  viewerIdentity: string;
}

export default function HostControls({ slug, viewerIdentity }: Props) {
  const [videoTrack, setVideoTrack] = useState<LocalTrack>();
  const [audioTrack, setAudioTrack] = useState<LocalTrack>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [hasSentNotification, setHasSentNotification] = useState(false);
  const [isStartingStream, setIsStartingStream] = useState(false); // Loading state for start stream button
  const [isStoppingStream, setIsStoppingStream] = useState(false); // Loading state for stop stream button
  const [isClosingStream, setIsClosingStream] = useState(false); // Loading state for close stream button
  const previewVideoEl = useRef<HTMLVideoElement>(null);
  console.log('previewVideo', previewVideoEl);
  const router = useRouter();
  const t = useTranslations('stream');
  const { localParticipant } = useLocalParticipant();
  const { user } = usePaxContext();

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

  useEffect(() => {
    return () => {
      videoTrack?.stop();
      audioTrack?.stop();
    };
  }, [videoTrack, audioTrack]);

  async function deleteTradingRoom() {
    setIsClosingStream(true); // Start loading
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
      toast.error('Error occurred');
    } else {
      toast.success('A room is closed');
      router.push('/profile/posts');
    }
    setIsClosingStream(false); // Stop loading
  }

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
  ]);

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex flex-col items-center justify-between'>
        <div className='flex gap-[5px] text-lg font-bold'>
          {isPublishing && !isUnpublishing ? (
            <div className='flex items-center gap-1'>
              <span className='relative mr-1 flex h-3 w-3'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75'></span>
                <span className='relative inline-flex h-3 w-3 rounded-full bg-red-500'></span>
              </span>
              LIVE
            </div>
          ) : (
            t('ready_stream')
          )}{' '}
        </div>
        <div className='flex gap-2'>
          {isPublishing ? (
            <Button
              size='sm'
              className='bg-red-600 hover:bg-red-700'
              onClick={() => void togglePublishing()}
              disabled={isUnpublishing || isStoppingStream}
            >
              {isStoppingStream ? (
                <Loader2 className='animate-spin' />
              ) : isUnpublishing ? (
                'Останавливаем...'
              ) : (
                'Остановить эфир'
              )}
            </Button>
          ) : (
            <Button
              size='sm'
              onClick={() => void togglePublishing()}
              className='animate-pulse'
              disabled={isStartingStream}
            >
              {isStartingStream ? (
                <Loader2 className='animate-spin' />
              ) : (
                t('start_stream')
              )}
            </Button>
          )}
          <Button
            size='sm'
            className='bg-red-600 hover:bg-red-700'
            onClick={deleteTradingRoom}
            disabled={isClosingStream}
          >
            {isClosingStream ? (
              <Loader2 className='animate-spin' />
            ) : (
              t('close_room')
            )}
          </Button>
          <Presence participantIdentity={viewerIdentity} />
        </div>
      </div>
      <div className='aspect-video flex-1 rounded-sm border bg-neutral-200 dark:bg-neutral-800 '>
        <video
          ref={previewVideoEl}
          className='h-full'
          width='100%'
          height='100%'
        />
      </div>
    </div>
  );
}
