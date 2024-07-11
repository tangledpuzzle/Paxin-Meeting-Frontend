import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useJoinRoomMutation } from '@/store/services/breakoutRoomApi';
import { store } from '@/store';
import { JoinBreakoutRoomReq } from '@/helpers/proto/plugnmeet_breakout_room_pb';
import { useTranslations } from 'next-intl';

interface IJoinBtnProps {
  breakoutRoomId: string;
}

const JoinBtn = ({ breakoutRoomId }: IJoinBtnProps) => {
  const t = useTranslations('meet');
  const [disable, setDisable] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [joinRoom, { isLoading, data }] = useJoinRoomMutation();

  useEffect(() => {
    setDisable(!!isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && data) {
      if (!data.status) {
        // @ts-ignore
        toast(t(data.msg), {
          type: 'error',
        });
        return;
      }

      setToken(data.token ?? '');
    }
    //eslint-disable-next-line
  }, [data, isLoading]);

  useEffect(() => {
    if (token !== '') {
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('access_token', token);
      const url =
        location.protocol +
        '//' +
        location.host +
        window.location.pathname +
        '?' +
        searchParams.toString();

      const opened = window.open(url, '_blank');
      if (!opened) {
        toast(t('breakout-room.open-tab-error'), {
          type: 'error',
        });
      }
    }
    //eslint-disable-next-line
  }, [token]);

  const join = () => {
    joinRoom(
      new JoinBreakoutRoomReq({
        breakoutRoomId: breakoutRoomId,
        userId: store.getState().session.currentUser?.userId ?? '',
      })
    );
  };

  return (
    <div className='join-btn mr-4'>
      <button
        className='mt-1 rounded-lg bg-primaryColor px-3 py-1 text-center text-xs font-semibold text-white transition ease-in hover:bg-secondaryColor'
        onClick={join}
        disabled={disable}
      >
        {t('breakout-room.join')}
      </button>
    </div>
  );
};

export default JoinBtn;
