'use client';

import { cn } from '@/lib/utils';
import { useRemoteParticipants } from '@livekit/components-react';
import Presence from './presence';
import { Icons } from './ui/icons';
import { BiSolidDonateHeart } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { useState, useContext, useEffect } from 'react';
import { PaxContext } from '@/context/context';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from './ui/dialog';

interface Props {
  streamerIdentity: string;
  viewerIdentity: string;
}

interface Participant {
  name?: string;
  metadata?: string;
  permissions?: {
    canPublish: boolean;
  };
}

interface FormValue {
  author: string;
  amount: string;
  sms: string;
}

export default function ChannelInfo({
  streamerIdentity,
  viewerIdentity,
}: Props) {
  const participants = useRemoteParticipants();
  const [open, setOpen] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationMSG, setDonationMSG] = useState('');
  const { user } = useContext(PaxContext);
  const [speakingParticipant, setSpeakingParticipant] = useState<Participant[]>(
    []
  );

  useEffect(() => {
    const filteredParticipants = participants.filter(
      (el: Participant) => el.permissions?.canPublish
    );
    setSpeakingParticipant(filteredParticipants);
  }, [participants]);

  const SendRequest = async (data: FormValue) => {
    try {
      const res = await fetch(`/api/profiles/donat`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
        body: JSON.stringify({
          data,
        }),
      });
      if (res.status === 200) {
        toast.success('Donation successful', {
          position: 'top-right',
        });
        setOpen(false);
      } else {
        toast.error('Donation failed', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('Donation failed', {
        position: 'top-right',
      });
    }
  };

  const handleDonation = () => {
    const data: FormValue = {
      author: speakingParticipant[0]?.name || '',
      amount: donationAmount,
      sms: donationMSG,
    };

    SendRequest(data);
  };

  return (
    <div className='absolute right-0 top-0 flex h-[110px] flex-col justify-center space-y-6 px-2 py-6 md:relative'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-6'>
          {speakingParticipant.length ? (
            <div className='hidden md:block'>
              <div className='grid place-items-center'>
                <div className='absolute z-10 h-11 w-11 animate-ping rounded-full bg-red-600 dark:bg-red-400' />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={cn(
                    'z-20 rounded-full border-2 border-white bg-gray-500 dark:border-zinc-900 md:h-16 md:w-16',
                    speakingParticipant[0] && 'ring-2 ring-red-600'
                  )}
                  src={`https://proxy.myru.online/100/https://img.myru.online/${speakingParticipant[0]?.metadata}`}
                  alt={speakingParticipant[0]?.name}
                />

                {speakingParticipant.length && (
                  <div className='absolute z-30 mt-14 w-12 rounded-xl border-2 border-white bg-red-600 p-1 text-center text-xs font-bold uppercase text-white transition-all dark:border-zinc-900'>
                    Live
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <div className='hidden md:block'>
            <div className='flex items-center gap-2'>
              <h1 className='text-lg font-bold text-white md:text-black'>
                {speakingParticipant[0]?.name}
              </h1>
              <div className='flex h-4 w-4 items-center justify-center rounded-full bg-blue-500'>
                <Icons.check className='h-3 w-3 text-white dark:text-zinc-900' />
              </div>
            </div>
          </div>
        </div>
        <div className='flex gap-2'>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                className='btn btn--wide h-[32px] w-full !rounded-md pr-4'
                asChild
              >
                <BiSolidDonateHeart />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Благодарность автору</DialogTitle>
                <DialogDescription>
                  Ваша поддержка помогает автору {speakingParticipant[0]?.name}{' '}
                  продолжать работу.
                </DialogDescription>
              </DialogHeader>
              Ваш баланс: {user?.balance} ₽
              <Input
                placeholder='Какую сумму хотите отправить?'
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
              />
              <Textarea
                value={donationMSG}
                onChange={(e) => setDonationMSG(e.target.value)}
                placeholder='Сопроводительное письмо'
              />
              <div className='mt-4'>
                <div className='flex gap-2'>
                  <Button onClick={handleDonation}>Поблагодарить</Button>
                  <Button onClick={() => setOpen(false)}>Закрыть</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Presence participantIdentity={viewerIdentity} />
        </div>
      </div>
    </div>
  );
}
