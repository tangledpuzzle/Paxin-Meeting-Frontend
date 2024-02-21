import React, { useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';

import { RootState, useAppSelector } from '@/store';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import {
  CommonResponse,
  UpdateWaitingRoomMessageReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

const waitingRoomMessageSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features.waiting_room_features,
  (waiting_room_features) => waiting_room_features?.waiting_room_msg
);

const UpdateRoomMessage = () => {
  const t = useTranslations('meet');
  const waitingRoomMessage = useAppSelector(waitingRoomMessageSelector);
  const [message, setMessage] = useState<string>(waitingRoomMessage ?? '');

  const updateRoomMsg = async () => {
    if (isEmpty(message)) {
      return;
    }
    const body = new UpdateWaitingRoomMessageReq({
      msg: message,
    });

    const r = await sendAPIRequest(
      'waitingRoom/updateMsg',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (res.status) {
      toast(t('waiting-room.updated-msg'), {
        type: 'info',
      });
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        type: 'error',
      });
    }
  };

  return (
    <div className='mb-4 text-right'>
      <p className='mb-2 block text-left text-sm capitalize text-black dark:text-darkText'>
        {t('waiting-room.update-waiting-message')}
      </p>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.currentTarget.value)}
        className='block h-20 w-full rounded-xl border border-solid border-primaryColor/20 bg-transparent p-3 text-sm outline-none dark:border-darkText dark:text-darkText'
      ></textarea>
      <button
        onClick={updateRoomMsg}
        className='ml-auto mr-0 mt-2 inline-block rounded-xl bg-primaryColor px-6 py-1 text-sm text-white transition ease-in hover:bg-secondaryColor'
      >
        {t('waiting-room.update-msg')}
      </button>
    </div>
  );
};

export default UpdateRoomMessage;
