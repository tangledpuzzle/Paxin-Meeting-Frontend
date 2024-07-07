import React from 'react';

import { IParticipant } from '@/store/slices/interfaces/participant';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { toast } from 'react-toastify';
import { store } from '@/store';
import {
  ApproveWaitingUsersReq,
  CommonResponse,
  RemoveParticipantReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

interface IBulkActionProps {
  waitingParticipants: IParticipant[];
}

const BulkAction = ({ waitingParticipants }: IBulkActionProps) => {
  const t = useTranslations('meet');

  const approveEveryone = () => {
    waitingParticipants.forEach(async (p) => {
      const body = new ApproveWaitingUsersReq({
        userId: p.userId,
      });

      const r = await sendAPIRequest(
        'waitingRoom/approveUsers',
        body.toBinary(),
        false,
        'application/protobuf',
        'arraybuffer'
      );
      const res = CommonResponse.fromBinary(new Uint8Array(r));

      if (!res.status) {
        // @ts-expect-error: no sms
        toast(t(res.msg), {
          type: 'error',
        });
      }
    });
  };

  const rejectEveryone = () => {
    const session = store.getState().session;
    const body = new RemoveParticipantReq({
      sid: session.currentRoom.sid,
      roomId: session.currentRoom.room_id,
    });
    waitingParticipants.forEach(async (p) => {
      body.userId = p.userId;
      body.msg = t('notifications.you-have-reject');
      body.blockUser = false;

      const r = await sendAPIRequest(
        'removeParticipant',
        body.toBinary(),
        false,
        'application/protobuf',
        'arraybuffer'
      );
      const res = CommonResponse.fromBinary(new Uint8Array(r));

      if (!res.status) {
        // @ts-expect-error: no sms
        toast(t(res.msg), {
          type: 'error',
        });
      }
    });
  };

  return (
    <div className='mb-4 flex flex-wrap items-center justify-start'>
      <button
        onClick={approveEveryone}
        className='block rounded-xl bg-primaryColor px-6 py-1 text-sm text-white transition ease-in hover:bg-secondaryColor ltr:mr-4 rtl:ml-4'
      >
        {t('waiting-room.accept-all')}
      </button>
      <button
        onClick={rejectEveryone}
        className='block rounded-xl bg-primaryColor px-6 py-1 text-sm text-white transition ease-in hover:bg-secondaryColor'
      >
        {t('waiting-room.reject-all')}
      </button>
    </div>
  );
};

export default BulkAction;
