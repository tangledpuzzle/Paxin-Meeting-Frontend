import React, { useEffect, useState } from 'react';

interface IDurationProps {
  duration: bigint;
  created: bigint;
}
const BreakoutRoomDuration = ({ duration, created }: IDurationProps) => {
  const [remaining, setRemaining] = useState<string>('00:00');

  useEffect(() => {
    const start = Number(created) * 1000;
    let diff, minutes, seconds;

    const timer = () => {
      diff = Number(duration) * 60 - (((Date.now() - start) / 1000) | 0);

      minutes = (diff / 60) | 0;
      seconds = diff % 60 | 0;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;

      setRemaining(minutes + ':' + seconds);
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
  }, [duration, created]);

  return (
    <>
      <div className='timer -ml-[1px] -mt-[1px] rounded-br-lg border border-solid border-primaryColor px-3 text-xs dark:border-white dark:text-white sm:py-[2px] md:text-sm'>
        {remaining}
      </div>
    </>
  );
};

export default BreakoutRoomDuration;
