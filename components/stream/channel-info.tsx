import { cn } from '@/lib/utils';
import { useRemoteParticipants } from '@livekit/components-react';
import Presence from './presence';
import { Icons } from './ui/icons';

interface Props {
  streamerIdentity: string;
  viewerIdentity: string;
}

export default function ChannelInfo({
  streamerIdentity,
  viewerIdentity,
}: Props) {
  const participants = useRemoteParticipants();

  const speakingParticipant = participants.filter(
    (el) => el.permissions?.canPublish
  );
  return (
    <div className='space-y-6 border-t px-8 py-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          <div className='grid place-items-center'>
            {speakingParticipant.length && (
              <div className='absolute z-10 h-11 w-11 animate-ping rounded-full bg-red-600 dark:bg-red-400' />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={cn(
                'z-20 h-16 w-16 rounded-full border-2 border-white bg-gray-500 dark:border-zinc-900',
                speakingParticipant[0] && 'ring-2 ring-red-600'
              )}
              src={`https://proxy.paxintrade.com/100/https://img.paxintrade.com/${speakingParticipant[0]?.metadata}`}
              alt={speakingParticipant[0]?.name}
            />

            {speakingParticipant.length && (
              <div className='absolute z-30 mt-14 w-12 rounded-xl border-2 border-white bg-red-600 p-1 text-center text-xs font-bold uppercase text-white transition-all dark:border-zinc-900'>
                Live
              </div>
            )}
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-lg font-bold'>
                {speakingParticipant[0]?.name}
              </h1>
              <div className='flex h-4 w-4 items-center justify-center rounded-full bg-blue-500'>
                <Icons.check className='h-3 w-3 text-white dark:text-zinc-900' />
              </div>
            </div>
          </div>
        </div>
        <Presence participantIdentity={viewerIdentity} />
      </div>
    </div>
  );
}
