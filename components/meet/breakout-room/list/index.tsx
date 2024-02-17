import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import BroadcastingMsg from './broadcastingMsg';
import RoomLists from './roomLists';
import { useEndAllRoomsMutation } from '@/store/services/breakoutRoomApi';
import { useAppDispatch } from '@/store';
import { updateShowManageBreakoutRoomModal } from '@/store/slices/bottomIconsActivitySlice';
import { useTranslations } from 'next-intl';

const BreakoutRoomLists = () => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();
  const [disable, setDisable] = useState<boolean>(false);
  const [endAllRooms, { isLoading, data }] = useEndAllRoomsMutation();

  useEffect(() => {
    setDisable(!!isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (data) {
      if (data.status) {
        toast(t('breakout-room.end-all-success'), {
          type: 'info',
        });
        dispatch(updateShowManageBreakoutRoomModal(false));
      } else {
        // @ts-ignore
        toast(t(data.msg), {
          type: 'error',
        });
      }
    }
    //eslint-disable-next-line
  }, [data]);

  const endAll = () => {
    endAllRooms();
  };

  const render = () => {
    return (
      <div className='manage-breakout-room-wrap'>
        <BroadcastingMsg />
        <RoomLists />
        <div className='btn flex items-end justify-end bg-gray-50 pb-3 pt-4 dark:bg-transparent'>
          <button
            className='inline-flex justify-center rounded-md border border-transparent bg-primaryColor px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-secondaryColor focus:bg-secondaryColor focus:outline-none focus:ring-2 focus:ring-offset-2'
            onClick={() => endAll()}
            disabled={disable}
          >
            {t('breakout-room.end-all')}
          </button>
        </div>
      </div>
    );
  };

  return render();
};

export default BreakoutRoomLists;
