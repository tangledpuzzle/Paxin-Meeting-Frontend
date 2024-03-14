'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useContext, useState } from 'react';
import { FaPlus, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { HiOutlinePlus } from 'react-icons/hi';
import { MdCallEnd } from 'react-icons/md';
import { PiMicrophoneLight, PiMicrophoneSlash } from 'react-icons/pi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { PaxContext } from '@/context/context';

interface UserType {
  id: string;
  username: string;
  avatar: string;
}

interface CallModalProps {
  children?: React.ReactNode;
  callee: UserType;
}

export default function CallModal({ children, callee }: CallModalProps) {
  const { user } = useContext(PaxContext);
  const [open, setOpen] = useState(false);
  const [isVideo, setIsVideo] = useState(true);
  const [isMicrophone, setIsMicrophone] = useState(true);

  const onEndCall = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => setOpen(true)}>
      <DialogTrigger asChild>
        {children ? children : <Button variant='outline'>Edit Profile</Button>}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <div className='my-8 flex justify-center gap-12'>
          <div className='relative flex flex-col items-center justify-center gap-2'>
            <div className='relative'>
              <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75 duration-1000'></span>
              <Avatar className='size-24'>
                <AvatarImage src={callee.avatar} alt={callee.username} />
                <AvatarFallback>{getInitials(callee.username)}</AvatarFallback>
              </Avatar>
            </div>
            <p className='line-clamp-1'>@{callee.username}</p>
          </div>
          <div className='flex flex-col items-center justify-center gap-2'>
            <Avatar className='size-24'>
              <AvatarImage
                src={`https://proxy.paxintrade.com/150/https://img.paxintrade.com/${user?.avatar}`}
                alt={user?.username || ''}
              />
              <AvatarFallback>
                {getInitials(user?.username || '')}
              </AvatarFallback>
            </Avatar>
            <p className='line-clamp-1'>@{user?.username || ''}</p>
          </div>
        </div>
        <DialogFooter className='!flex-row !justify-center'>
          <Button
            variant='default'
            size='icon'
            className='size-10 rounded-full bg-green-500 hover:bg-green-500/70'
            onClick={() => setIsVideo(!isVideo)}
          >
            {isVideo ? (
              <FaVideo className='size-5' />
            ) : (
              <FaVideoSlash className='size-5' />
            )}
          </Button>
          <Button
            variant='default'
            size='icon'
            className='size-10 rounded-full bg-green-500 hover:bg-green-500/70'
            onClick={() => setIsMicrophone(!isMicrophone)}
          >
            {isMicrophone ? (
              <PiMicrophoneLight className='size-5' />
            ) : (
              <PiMicrophoneSlash className='size-5' />
            )}
          </Button>
          <Button
            variant='default'
            size='icon'
            className='size-10 rounded-full bg-red-500 hover:bg-red-500/70'
            onClick={onEndCall}
          >
            <MdCallEnd className='size-5' />
          </Button>
          <Button
            variant='default'
            size='icon'
            className='size-10 rounded-full bg-green-500 hover:bg-green-500/70'
          >
            <HiOutlinePlus className='size-5' />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
