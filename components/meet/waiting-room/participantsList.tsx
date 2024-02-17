import React from 'react';

import { IParticipant } from '@/store/slices/interfaces/participant';
import sendAPIRequest from '@/helpers/api/plugNmeetAPI';
import { toast } from 'react-toastify';
import { store } from '@/store';
import {
  ApproveWaitingUsersReq,
  CommonResponse,
  RemoveParticipantReq,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

interface IParticipantsListProps {
  waitingParticipants: IParticipant[];
}

const ParticipantsList = ({ waitingParticipants }: IParticipantsListProps) => {
  const t = useTranslations('meet');
  const acceptUser = async (userId: string) => {
    const body = new ApproveWaitingUsersReq({
      userId: userId,
    });

    const r = await sendAPIRequest(
      'waitingRoom/approveUsers',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (res.status) {
      toast(
        t('left-panel.menus.notice.user-approved', {
          name: 'error',
        }),
        {
          type: 'info',
        }
      );
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        type: 'error',
      });
    }
  };

  const rejectUser = async (userId: string, block: boolean) => {
    const session = store.getState().session;
    const body = new RemoveParticipantReq({
      sid: session.currentRoom.sid,
      roomId: session.currentRoom.room_id,
      userId: userId,
      msg: t('notifications.you-have-reject').toString(),
      blockUser: block,
    });

    const r = await sendAPIRequest(
      'removeParticipant',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (res.status) {
      toast(t('left-panel.menus.notice.participant-removed'), {
        toastId: 'user-remove-status',
        type: 'info',
      });
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        type: 'error',
      });
    }
  };

  const renderWaitingParticipants = () => {
    return waitingParticipants.map((p) => {
      return (
        <div
          className='waiting-list-item mb-2 w-full max-w-max border-b border-solid border-primaryColor pb-2'
          key={p.userId}
        >
          <p className='text-base text-black dark:text-darkText'>{p.name}</p>
          <button
            onClick={() => acceptUser(p.userId)}
            className='rounded-lg bg-primaryColor px-2 py-[1px] text-xs text-white transition ease-in hover:bg-secondaryColor'
          >
            {t('left-panel.approve')}
          </button>
          <button
            onClick={() => rejectUser(p.userId, false)}
            className='rounded-lg bg-red-600 px-2 py-[1px] text-xs text-white transition ease-in hover:bg-red-800 ltr:ml-2 rtl:mr-2'
          >
            {t('left-panel.reject')}
          </button>
          <button
            onClick={() => rejectUser(p.userId, true)}
            className='rounded-lg bg-red-600 px-2 py-[1px] text-xs text-white transition ease-in hover:bg-red-800 ltr:ml-2 rtl:mr-2'
          >
            {t('waiting-room.reject-and-block-user')}
          </button>
        </div>
      );
    });
  };

  return (
    <div className='waiting-list-wrap'>
      <p className='my-4 text-lg font-bold text-black dark:text-white ltr:text-left rtl:text-right'>
        {t('waiting-room.list-waiting-participants', {
          count: waitingParticipants.length,
        })}
      </p>
      <div className='waiting-list scrollBar h-[130px] overflow-auto'>
        <div className='waiting-list-inner'>{renderWaitingParticipants()}</div>
      </div>
    </div>
  );
};

export default ParticipantsList;
