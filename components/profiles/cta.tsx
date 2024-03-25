import { FaHardDrive, FaSackDollar, FaUserClock } from 'react-icons/fa6';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { PaxContext } from '@/context/context';
import { useContext } from 'react';
import { PlanUpgradeModal } from './plan-upgrade-modal';
import Link from 'next/link';

interface CTAProps {
  title: string;
  description?: string;
  icon: React.ComponentType<any>;
}

function formatTime(hours: number, minutes: number, seconds: number) {
  return `${String(hours).padStart(2, '0')}h : ${String(minutes).padStart(2, '0')}m : ${String(seconds).padStart(2, '0')}s`;
}

function Clock({
  initialHours,
  initialMinutes,
  initialSeconds,
}: {
  initialHours: number;
  initialMinutes: number;
  initialSeconds: number;
}) {
  const [currentTime, setCurrentTime] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    setCurrentTime({
      hours: initialHours,
      minutes: initialMinutes,
      seconds: initialSeconds,
    });
  }, [initialHours, initialMinutes, initialSeconds]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setCurrentTime((prevTime) => {
        let { hours, minutes, seconds } = prevTime;
        seconds++;
        if (seconds === 60) {
          seconds = 0;
          minutes++;
          if (minutes === 60) {
            minutes = 0;
            hours++;
            if (hours === 24) {
              hours = 0;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className='clock'>
      <span className='clock-time'>
        {formatTime(
          currentTime.hours,
          currentTime.minutes,
          currentTime.seconds
        )}
      </span>
    </div>
  );
}

export default function CTASection({ title, description, icon }: CTAProps) {
  const { user } = useContext(PaxContext);

  const Icon = icon;
  const initialHours = user?.onlinehours?.hour || 0;
  const initialMinutes = user?.onlinehours?.minutes || 0;
  const initialSeconds = user?.onlinehours?.seconds || 0;

  return (
    <div className='flex w-full flex-col justify-between gap-2 sm:flex-row sm:items-center'>
      <div className='flex items-center gap-2'>
        <div className='rounded-full bg-primary/10 p-3 text-primary'>
          <Icon className='size-5' />
        </div>
        <div>
          <div className='text-lg font-semibold'>{title}</div>
          <div className='hidden text-sm text-muted-foreground lg:block'>
            {description || ''}
          </div>
        </div>
        {/* <PlanUpgradeModal>
          <Button variant='outline' className='ml-auto sm:hidden'>
            <FaHardDrive className='mr-2 size-4' />
            {user?.storage || 0} / {user?.limitStorage || 0} MB
          </Button>
        </PlanUpgradeModal> */}
      </div>
      <div className='flex gap-2'>
        {/* <PlanUpgradeModal>
          <Button variant='outline' className='hidden w-full sm:flex'>
            <FaHardDrive className='mr-2 size-4' />
            {user?.storage || 0} / {user?.limitStorage || 0} MB
          </Button>
        </PlanUpgradeModal> */}
        {/* <Button variant='outline' className='w-full' asChild>
          <Link href='/profile/setting?tab=accounting'>
            <FaSackDollar className='mr-2 size-4' />
            {user?.balance || 0}
          </Link>
        </Button> */}
        <Button variant='outline' className='w-full'>
          <FaUserClock className='mr-2 size-4 text-primary' />
          <Clock
            initialHours={initialHours}
            initialMinutes={initialMinutes}
            initialSeconds={initialSeconds}
          />
        </Button>
      </div>
    </div>
  );
}
