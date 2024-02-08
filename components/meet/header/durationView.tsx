import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { store } from '@/store';
import { useTranslations } from 'next-intl';

interface IDurationViewProps {
  duration: number;
}
const DurationView = ({ duration }: IDurationViewProps) => {
  const t = useTranslations('meet');
  const isRecorder = store.getState().session.currentUser?.isRecorder;

  const [remaining, setRemaining] = useState<string>('00:00');
  // if duration is less than 60 minutes then we'll show clock only.
  const [showClock, setShowClock] = useState<boolean>(false);

  useEffect(() => {
    const startedAt = store.getState().session.currentRoom.metadata?.started_at;
    const start = startedAt ? Number(startedAt) * 1000 : Date.now();
    let diff, minutes, seconds;
    setRemaining('00:00');

    const timer = () => {
      diff = duration * 60 - (((Date.now() - start) / 1000) | 0);

      minutes = (diff / 60) | 0;
      seconds = diff % 60 | 0;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      setRemaining(minutes + ':' + seconds);
      if (minutes < 60) {
        setShowClock(true);
      }
      if (diff <= 0) {
        setRemaining('00:00');
      }
    };

    const interval = setInterval(() => {
      timer();
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [duration]);

  useEffect(() => {
    if (isRecorder) {
      return;
    }

    switch (remaining) {
      case '60:00':
      case '30:00':
      case '10:00':
      case '5:00':
        toast(
          t('notifications.room-will-end-in', {
            minutes: remaining,
          }),
          {
            type: 'warning',
          }
        );
    }
  }, [isRecorder, remaining, t]);

  return (
    <>
      {showClock ? (
        <div className='timer mr-[6px] mt-[2px] rounded-lg border border-solid border-primaryColor px-3 text-xs dark:border-darkText/80 dark:text-darkText/80 sm:py-[2px] md:text-sm'>
          {remaining}
        </div>
      ) : null}
    </>
  );
};

export default DurationView;
