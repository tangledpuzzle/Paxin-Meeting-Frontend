import { Button } from '@/components/ui/button';
import apiHelper from '@/helpers/api/apiRequest';
import { useLocalParticipant } from '@livekit/components-react';
import { Track, createLocalTracks, type LocalTrack } from 'livekit-client';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  slug: string;
}

export default function HostControls({ slug }: Props) {
  const [videoTrack, setVideoTrack] = useState<LocalTrack>();
  const [audioTrack, setAudioTrack] = useState<LocalTrack>();
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const previewVideoEl = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const t = useTranslations('stream');
  const { localParticipant } = useLocalParticipant();

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
  async function deleteTradingRoom() {
    const response = await apiHelper({
      url: process.env.NEXT_PUBLIC_PAXTRADE_API_URL + 'room/delete/' + slug,
      method: 'DELETE',
    });
    if (response == null) {
      toast.error('Error occurred');
    } else {
      toast.success('A room is closed');
      router.push('/chat');
    }
  }
  const togglePublishing = useCallback(async () => {
    if (isPublishing && localParticipant) {
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
      }, 2000);
    } else if (localParticipant) {
      if (videoTrack) {
        void localParticipant.publishTrack(videoTrack);
      }
      if (audioTrack) {
        void localParticipant.publishTrack(audioTrack);
      }
    }

    setIsPublishing((prev) => !prev);
  }, [audioTrack, isPublishing, localParticipant, videoTrack]);

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
            'Ready to stream'
          )}{' '}
        </div>
        <div className='flex gap-2'>
          {isPublishing ? (
            <Button
              size='sm'
              className='bg-red-600 hover:bg-red-700'
              onClick={() => void togglePublishing()}
              disabled={isUnpublishing}
            >
              {isUnpublishing ? 'Stopping...' : 'Stop stream'}
            </Button>
          ) : (
            <Button
              size='sm'
              onClick={() => void togglePublishing()}
              className='animate-pulse'
            >
              Start stream
            </Button>
          )}
          <Button
            size='sm'
            className='bg-red-600 hover:bg-red-700'
            onClick={deleteTradingRoom}
          >
            {t('close_room')}
          </Button>
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
