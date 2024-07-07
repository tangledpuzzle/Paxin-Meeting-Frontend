import React, { useEffect, useState } from 'react';
import { useBroadcastBreakoutRoomMsgMutation } from '@/store/services/breakoutRoomApi';
import { toast } from 'react-toastify';
import { BroadcastBreakoutRoomMsgReq } from '@/helpers/proto/plugnmeet_breakout_room_pb';
import { useTranslations } from 'next-intl';

const BroadcastingMsg = () => {
  const t = useTranslations('meet');
  const [msg, setMsg] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(false);
  const [broadcastMsg, { isLoading, data }] =
    useBroadcastBreakoutRoomMsgMutation();

  useEffect(() => {
    setDisable(!!isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      if (data.status) {
        toast(t('breakout-room.broadcast-msg-success'), {
          type: 'info',
        });
        setMsg('');
      } else {
        // ☢️
        // @ts-expect-error: no sms
        toast(t(data.msg), {
          type: 'error',
        });
      }
    }
    //eslint-disable-next-line
  }, [data]);

  const send = () => {
    if (msg === '') {
      return;
    }
    broadcastMsg(
      new BroadcastBreakoutRoomMsgReq({
        msg,
      })
    );
  };

  return (
    <div className='broadcasting-message mb-4 flex flex-wrap items-end border-b border-solid border-primaryColor/50 pb-4'>
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.currentTarget.value)}
        className='block min-h-[60px] w-full rounded border border-solid border-primaryColor bg-transparent p-2 outline-none dark:border-darkText dark:text-darkText sm:w-[calc(100%-12rem)]'
      ></textarea>
      <button
        onClick={send}
        disabled={disable}
        className='mt-2 inline-flex w-44 justify-center rounded-md bg-primaryColor px-3 py-1 text-sm font-medium text-white hover:bg-secondaryColor focus:outline-none sm:ml-4'
      >
        {t('breakout-room.broadcast-msg')}
      </button>
    </div>
  );
};

export default BroadcastingMsg;
