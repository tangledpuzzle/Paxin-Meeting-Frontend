import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useEndSingleRoomMutation } from '@/store/services/breakoutRoomApi';
import { EndBreakoutRoomReq } from '@/helpers/proto/plugnmeet_breakout_room_pb';
import { useTranslations } from 'next-intl';

interface IEndBtnProps {
  breakoutRoomId: string;
}
const EndBtn = ({ breakoutRoomId }: IEndBtnProps) => {
  const t = useTranslations('meet');
  const [endSingleRoom, { isLoading, data }] = useEndSingleRoomMutation();
  const [disable, setDisable] = useState<boolean>(false);

  useEffect(() => {
    setDisable(!!isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      if (data.status) {
        toast(t('breakout-room.room-ended'), {
          type: 'info',
        });
      } else {
        // @ts-ignore
        toast(t(data.msg), {
          type: 'error',
        });
      }
    }
    //eslint-disable-next-line
  }, [data]);

  const endRoom = () => {
    endSingleRoom(new EndBreakoutRoomReq({ breakoutRoomId }));
  };

  return (
    <div className='end-room-btn'>
      <button
        className='mt-1 rounded-lg bg-brandRed px-3 py-1 text-center text-xs font-semibold text-white transition ease-in hover:bg-brandRed/90'
        onClick={endRoom}
        disabled={disable}
      >
        {t('breakout-room.end-room')}
      </button>
    </div>
  );
};

export default EndBtn;
