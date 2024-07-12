import {
    useConnectionState,
    useRemoteParticipant,
    useTracks,
  } from '@livekit/components-react';
  import { ConnectionState, Track } from 'livekit-client';
  import React, { useRef } from 'react';
  import { useTranslations } from 'next-intl';
  import StreamPlayer from './stream-player';
  
  interface Props {
    streamerIdentity: string;
  }
  
  function toString(connectionState: string) {
    switch (connectionState) {
      case 'connected':
        return 'Connected!';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Disconnected';
      case 'reconnecting':
        return 'Reconnecting';
      default:
        return 'Unknown';
    }
  }
  
  export default function StreamPlayerWrapper({ streamerIdentity }: Props) {
    const connectionState = useConnectionState();
    const t = useTranslations('stream');
    const participant = useRemoteParticipant(streamerIdentity);
    const tracks = useTracks([Track.Source.Camera]).filter(
      (track) => track.participant.identity === streamerIdentity
    );
  
    const videoRef = useRef<HTMLVideoElement>(null);
  
    if (connectionState !== ConnectionState.Connected || !participant) {
      return (
        <div className='grid h-full items-center justify-center bg-black text-sm uppercase text-white'>
          {connectionState === ConnectionState.Connected
            ? t('offline_message')
            : toString(connectionState)}
        </div>
      );
    } else if (tracks.length === 0) {
      return (
        <div className='flex h-[calc(100%)] items-center justify-center bg-black text-sm uppercase text-white'>
          <div className='flex gap-2'>
            <div className='h-4 w-4 animate-bounce rounded-full bg-neutral-400 delay-100' />
            <div className='h-4 w-4 animate-bounce rounded-full bg-neutral-500 delay-200' />
            <div className='h-4 w-4 animate-bounce rounded-full bg-neutral-600 delay-300' />
          </div>
        </div>
      );
    }
  
    return <StreamPlayer ref={videoRef} participant={participant} />;
  }
  