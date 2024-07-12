import { useTracks } from '@livekit/components-react';
import { Track, Participant } from 'livekit-client';
import React, { useCallback, useRef, useState, forwardRef, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Icons } from './ui/icons';

const StreamPlayer = forwardRef<HTMLVideoElement, { participant: Participant }>(({ participant }, ref) => {
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [audioPlaybackAllowed, setAudioPlaybackAllowed] = useState(false);
  const videoEl = ref as React.RefObject<HTMLVideoElement>;
  const playerEl = useRef<HTMLDivElement>(null);

  const tracks = useTracks(Object.values(Track.Source)).filter(
    (track) => track.participant.identity === participant.identity
  );

  useEffect(() => {
    if (videoEl.current) {
      tracks.forEach((track) => {
        if (videoEl.current) {
          track.publication.track?.attach(videoEl.current);
        }
      });
    }
  }, [videoEl, tracks]);

  const onVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMuted(e.target.value === '0');
      setVolume(+e.target.value);
      if (videoEl.current) {
        videoEl.current.muted = e.target.value === '0';
        videoEl.current.volume = +e.target.value * 0.01;
      }
    },
    [videoEl]
  );

  const onToggleMute = useCallback(() => {
    setMuted(!muted);
    setVolume(muted ? 50 : 0);
    if (videoEl.current) {
      videoEl.current.muted = !muted;
      videoEl.current.volume = muted ? 0.5 : 0;
    }
  }, [muted, videoEl]);

  const onFullScreen = useCallback(() => {
    if (isFullScreen) {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullScreen(false);
    } else if (playerEl.current) {
      playerEl.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullScreen(true);
    }
  }, [isFullScreen, playerEl]);

  const onAllowAudioPlayback = useCallback(() => {
    setAudioPlaybackAllowed(true);
    if (videoEl.current) {
      videoEl.current.muted = false;
      videoEl.current.play().catch((err) => console.error(err));
    }
  }, [videoEl]);

  return (
    <TooltipProvider delayDuration={300}>
      <div className='relative flex h-full bg-black' ref={playerEl}>
        <video ref={videoEl} width='100%' style={{ objectFit: 'cover' }} />
        <div className='absolute top-0 h-full w-full opacity-0 hover:opacity-100 hover:transition-all'>
          <div className='absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-t from-neutral-900 px-4'>
            <div className='flex items-center gap-2'>
              <Tooltip>
                <TooltipTrigger>
                  <div className='text-white' onClick={onToggleMute}>
                    {muted ? (
                      <Icons.volumeOff className='h-6 w-6 hover:scale-110 hover:transition-all' />
                    ) : (
                      <Icons.volumeOn className='h-6 w-6 hover:scale-110 hover:transition-all' />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>{muted ? 'Unmute' : 'Mute'}</TooltipContent>
              </Tooltip>
              <input
                type='range'
                onChange={onVolumeChange}
                className='ml-1 h-0.5 w-24 cursor-pointer appearance-none rounded-full bg-white accent-white'
                value={volume}
              />
            </div>
            <div className='flex items-center justify-center gap-4'>
              <Tooltip>
                <TooltipTrigger>
                  <div className='text-white' onClick={onFullScreen}>
                    {isFullScreen ? (
                      <Icons.minimize className='h-5 w-5 hover:scale-110 hover:transition-all' />
                    ) : (
                      <Icons.maximize className='h-5 w-5 hover:scale-110 hover:transition-all' />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
        {!audioPlaybackAllowed && (
          <div className='absolute z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-75 text-white'>
            <button
              className='bg-primary hover:bg-blue-700 px-4 py-2 rounded'
              onClick={onAllowAudioPlayback}
            >
              Начать просмотр
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
});

export default StreamPlayer;
