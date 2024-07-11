import React, { useEffect, useState } from 'react';

import { toast } from 'react-toastify';

import { useIncreaseDurationMutation } from '@/store/services/breakoutRoomApi';
import { IncreaseBreakoutRoomDurationReq } from '@/helpers/proto/plugnmeet_breakout_room_pb';
import { useTranslations } from 'next-intl';

interface IExtendTimeProps {
  breakoutRoomId: string;
}
const ExtendDuration = ({ breakoutRoomId }: IExtendTimeProps) => {
  const t = useTranslations('meet');
  const [duration, setDuration] = useState<number>(5);
  const [disable, setDisable] = useState<boolean>(false);
  const [increaseDuration, { isLoading, data }] = useIncreaseDurationMutation();

  useEffect(() => {
    setDisable(!!isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      if (data.status) {
        toast(t('breakout-room.duration-extended'), {
          type: 'info',
        });
      } else {
        //@ts-ignore
        toast(t(data.msg), {
          type: 'error',
        });
      }
    }
    //eslint-disable-next-line
  }, [data]);

  const extendDuration = () => {
    increaseDuration(
      new IncreaseBreakoutRoomDurationReq({
        breakoutRoomId: breakoutRoomId,
        duration: BigInt(duration),
      })
    );
  };

  return (
    <div className='extend-time-wrapper mb-2 mr-2 flex items-center'>
      <input
        value={duration}
        onChange={(e) => setDuration(Number(e.currentTarget.value))}
        placeholder={t('breakout-room.extend-duration').toString()}
        className='block h-9 w-full max-w-[100px] rounded border border-solid border-secondaryColor bg-transparent px-2 py-1 outline-none dark:border-darkText dark:text-darkText sm:max-w-[140px]'
      />
      <button
        onClick={extendDuration}
        disabled={disable}
        className='ml-2 h-8 w-[180px] rounded-lg bg-primaryColor px-3 py-1 text-center text-xs font-semibold text-white transition ease-in hover:bg-secondaryColor sm:ml-4'
      >
        {t('breakout-room.extend-duration')}
      </button>
    </div>
  );
};

export default ExtendDuration;
