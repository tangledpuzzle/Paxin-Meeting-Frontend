import React, { useEffect, useState } from 'react';

const timeZone: Intl.DateTimeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
};

const dateString: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
};
export default function Timer() {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const updateTime = (): void => {
      setTime(new Date());
    };
    const timer: ReturnType<typeof setInterval> = setInterval(
      updateTime,
      1000 * 60
    );

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <span>
      {time.toLocaleTimeString(undefined, timeZone)} -
      {time.toLocaleDateString(undefined, dateString)}
    </span>
  );
}
