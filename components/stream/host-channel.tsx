"use client"
import Chat from './host-chat';
import { LiveKitRoom, RoomContext, useLocalParticipant, useParticipants } from '@livekit/components-react';
import { createLocalTracks, LocalTrack, Track, Room } from 'livekit-client';
import { useEffect, useState, useRef, useContext, useCallback } from 'react';
import toast from 'react-hot-toast';
import apiHelper from '@/helpers/api/apiRequest';
import { useRouter } from 'next/navigation';
import { usePaxContext, PaxContext } from '@/context/context';
import { Loader2 } from 'lucide-react';
import MicrophoneModal from '@/components/meet/footer/modals/microphoneModal';
import ShareWebcamModal from '@/components/meet/footer/modals/webcam/shareWebcamStream';
import ProductPanel, { IProduct } from './product-panel';

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
  const [showWebcamModal, setShowWebcamModal] = useState(false);
  const [showMicrophoneModal, setShowMicrophoneModal] = useState(false);
  const [selectedWebcam, setSelectedWebcam] = useState<string>('');
  const [selectedMic, setSelectedMic] = useState<string>('');
  const [videoTrack, setVideoTrack] = useState<LocalTrack | null>(null);
  const [audioTrack, setAudioTrack] = useState<LocalTrack | null>(null);
  const router = useRouter();
  const { user } = usePaxContext();
  const { lastCommand, additionalData } = useContext(PaxContext);

  useEffect(() => {
    if (lastCommand === 'newDonat' && additionalData.length > 0) {
      additionalData.forEach(data => {
        toast.success(`Донат от: ${data.name}, Сумму: ${data.total}, Сообщение: ${data.msg}`, {
          position: 'top-right',
        });
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
      const tokenKey = Object.keys(localStorage).find((key) => key.startsWith(storeRoomId));
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
      <RoomContext.Consumer>
        {room => room ? (
          <>
            <HostStreamManager
              room={room}
              userId={userId}
              sendPushNotification={sendPushNotification}
              deleteTradingRoom={deleteTradingRoom}
              products={products}
              setShowWebcamModal={setShowWebcamModal}
              setShowMicrophoneModal={setShowMicrophoneModal}
              videoTrack={videoTrack}
              setVideoTrack={setVideoTrack}
              audioTrack={audioTrack}
              setAudioTrack={setAudioTrack}
              selectedWebcam={selectedWebcam}
              setSelectedWebcam={setSelectedWebcam}
              selectedMic={selectedMic}
              setSelectedMic={setSelectedMic}
            />

            <ShareWebcamModal
              isOpen={showWebcamModal}
              onSelectedDevice={async (deviceId: string) => {
                const tracks = await createLocalTracks({ video: { deviceId } });
                const newVideoTrack = tracks.find(track => track.kind === Track.Kind.Video) as LocalTrack;
                await room.localParticipant.publishTrack(newVideoTrack);
                setVideoTrack(newVideoTrack);
                setSelectedWebcam(deviceId);
                setShowWebcamModal(false);
                console.log('Selected webcam device:', deviceId);
              }}
              onClose={() => setShowWebcamModal(false)}
            />

            <MicrophoneModal
              show={showMicrophoneModal}
              onCloseMicrophoneModal={async (deviceId?: string) => {
                if (deviceId) {
                  const tracks = await createLocalTracks({ audio: { deviceId } });
                  const newAudioTrack = tracks.find(track => track.kind === Track.Kind.Audio) as LocalTrack;
                  await room.localParticipant.publishTrack(newAudioTrack);
                  setAudioTrack(newAudioTrack);
                  setSelectedMic(deviceId);
                  console.log('Selected microphone device:', deviceId);
                }
                setShowMicrophoneModal(false);
              }}
            />
          </>
        ) : (
          <div>Loading...</div>
        )}
      </RoomContext.Consumer>
    </LiveKitRoom>
  );
}

interface HostStreamManagerProps {
  room: Room;
  userId: string;
  sendPushNotification: () => Promise<void>;
  deleteTradingRoom: () => Promise<void>;
  products: IProduct[];
  setShowWebcamModal: (show: boolean) => void;
  setShowMicrophoneModal: (show: boolean) => void;
  videoTrack: LocalTrack | null;
  setVideoTrack: (track: LocalTrack | null) => void;
  audioTrack: LocalTrack | null;
  setAudioTrack: (track: LocalTrack | null) => void;
  selectedWebcam: string;
  setSelectedWebcam: (deviceId: string) => void;
  selectedMic: string;
  setSelectedMic: (deviceId: string) => void;
}

function HostStreamManager({
  room,
  userId,
  sendPushNotification,
  deleteTradingRoom,
  products,
  setShowWebcamModal,
  setShowMicrophoneModal,
  videoTrack,
  setVideoTrack,
  audioTrack,
  setAudioTrack,
  selectedWebcam,
  setSelectedWebcam,
  selectedMic,
  setSelectedMic,
}: HostStreamManagerProps) {
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [hasSentNotification, setHasSentNotification] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [isStartingStream, setIsStartingStream] = useState(false);
  const [isStoppingStream, setIsStoppingStream] = useState(false);
  const [isClosingStream, setIsClosingStream] = useState(false);
  const previewVideoEl = useRef<HTMLVideoElement>(null);
  const localParticipant = room.localParticipant;
  const participants = useParticipants();

  const createTracks = async (micId?: string, camId?: string) => {
    const tracks = await createLocalTracks({ audio: { deviceId: micId }, video: { deviceId: camId } });
    tracks.forEach((track) => {
      switch (track.kind) {
        case Track.Kind.Video: {
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
    void createTracks(selectedMic, selectedWebcam);
  }, [selectedMic, selectedWebcam]);

  useEffect(() => {
    return () => {
      videoTrack?.stop();
      audioTrack?.stop();
    };
  }, [videoTrack, audioTrack]);

  useEffect(() => {
    setParticipantCount(participants.length);
  }, [participants]);

  useEffect(() => {
    if (videoTrack && previewVideoEl.current) {
      console.log('Attaching video track to video element:', videoTrack);
      videoTrack.attach(previewVideoEl.current);
    }
  }, [videoTrack]);

  const leaveWebcam = useCallback(() => {
    room.localParticipant.videoTrackPublications.forEach(async (publication) => {
      if (publication.track && publication.track.source === Track.Source.Camera) {
        await room.localParticipant.unpublishTrack(publication.track, true);
      }
    });
    setVideoTrack(null);
  }, [room]);

  const leaveMic = useCallback(() => {
    room.localParticipant.audioTrackPublications.forEach(async (publication) => {
      if (publication.track && publication.track.kind === Track.Kind.Audio) {
        await room.localParticipant.unpublishTrack(publication.track, true);
      }
    });
    setAudioTrack(null);
  }, [room]);

  useEffect(() => {
    if (selectedWebcam) {
      leaveWebcam();
    }
  }, [selectedWebcam, leaveWebcam]);

  useEffect(() => {
    if (selectedMic) {
      leaveMic();
    }
  }, [selectedMic, leaveMic]);

  const togglePublishing = useCallback(async () => {
    if (isPublishing && localParticipant) {
      setIsStoppingStream(true);
      setIsUnpublishing(true);

      if (videoTrack) {
        console.log('Unpublishing video track');
        await localParticipant.unpublishTrack(videoTrack);
      }
      if (audioTrack) {
        console.log('Unpublishing audio track');
        await localParticipant.unpublishTrack(audioTrack);
      }

      await createTracks(selectedMic, selectedWebcam);

      setTimeout(() => {
        setIsUnpublishing(false);
        setIsStoppingStream(false);
      }, 2000);
    } else if (localParticipant) {
      setIsStartingStream(true);

      if (videoTrack) {
        console.log('Publishing video track');
        await localParticipant.publishTrack(videoTrack);
      }
      if (audioTrack) {
        console.log('Publishing audio track');
        await localParticipant.publishTrack(audioTrack);
      }

      if (!hasSentNotification) {
        await sendPushNotification();
        setHasSentNotification(true);
      }
      setIsStartingStream(false);
    }

    setIsPublishing((prev) => !prev);
  }, [audioTrack, isPublishing, localParticipant, videoTrack, sendPushNotification, selectedMic, selectedWebcam]);

  return (
    <div className='flex h-full flex-col gap-4'>
      <div className='flex flex-col items-center justify-between absolute z-40 w-full md:w-[250px] top-4 md:right-[50px]'>
        <div className='flex gap-[5px] text-white mb-4 text-lg font-bold'>
          {isPublishing && !isUnpublishing ? (
            <div className='flex items-center gap-1'>
              <span className='relative mr-1 flex h-3 w-3'>
                <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75'></span>
                <span className='relative inline-flex h-3 w-3 rounded-full bg-red-500'></span>
              </span>
               (кол-во зрителей {participantCount})
            </div>
          ) : (
            'Готов к эфиру'
          )}{' '}
        </div>
        <div className='flex gap-2 px-4'>
          {/* <button
            className='bg-primary hover:bg-blue-700 px-4 py-2 rounded animate-pulse text-xs md:text-md'
            onClick={() => setShowMicrophoneModal(true)}
          >
            Выбрать микрофон
          </button> */}
          <button
            className='bg-primary hover:bg-blue-700 px-4 py-2 rounded animate-pulse text-xs md:text-md'
            onClick={() => {
              setShowWebcamModal(true);
            }}
          >
            Выбрать камеру
          </button>
          {isPublishing ? (
            <button
              className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-xs md:text-md'
              onClick={() => void togglePublishing()}
              disabled={isUnpublishing || isStoppingStream}
            >
              {isStoppingStream ? <Loader2 className='animate-spin' /> : isUnpublishing ? 'Останавливаем...' : 'Поставить паузу'}
            </button>
          ) : (
            <button
              className='bg-primary hover:bg-blue-700 px-4 py-2 rounded animate-pulse text-xs md:text-md'
              onClick={() => void togglePublishing()}
              disabled={isStartingStream}
            >
              {isStartingStream ? <Loader2 className='animate-spin' /> : 'Начать эфир'}
            </button>
          )}
          <button
            className='bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-xs md:text-md'
            onClick={async () => {
              setIsClosingStream(true); // Start loading
              await deleteTradingRoom();
              setIsClosingStream(false); // Stop loading
            }}
            disabled={isClosingStream}
          >
            {isClosingStream ? <Loader2 className='animate-spin' /> : 'Закрыть эфир'}
          </button>
        </div>
      </div>
      <div className='flex-1 rounded-sm border bg-neutral-200 dark:bg-neutral-800 relative'>
        <video
          ref={previewVideoEl}
          className='h-full w-full absolute inset-0'
          style={{ objectFit: 'cover' }}
        />
        <div className='flex h-full w-full justify-between md:h-full rtl:flex-row-reverse absolute inset-0 z-10'>
          <div className='relative w-full md:block'>
            <div className='absolute bottom-0 right-0 top-0 flex h-full w-full md:w-[340px] pt-[120px] flex-col gap-2 p-2 bg-black/40'>
              <Chat participantName={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}