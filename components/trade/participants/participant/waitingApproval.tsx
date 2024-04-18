import React, { useCallback, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';

import { useAppSelector } from '@/store/hook';
import { participantsSelector } from '@/store/slices/participantSlice';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import {
  ApproveWaitingUsersReq,
  CommonResponse,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

interface IWaitingApprovalProps {
  userId: string;
  name: string;
  openRemoveParticipantAlert(userId: string, type: string): void;
}
const WaitingApproval = ({
  userId,
  name,
  openRemoveParticipantAlert,
}: IWaitingApprovalProps) => {
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, userId)
  );
  const t = useTranslations('meet');

  const approve = useCallback(async () => {
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
      toast(t('left-panel.menus.notice.user-approved', { name: name }), {
        type: 'info',
      });
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        type: 'error',
      });
    }
  }, []);

  // const reject = () => {
  //   openRemoveParticipantAlert(userId, 'reject');
  // };
  useEffect(() => {
    if (participant?.metadata.wait_for_approval) {
      approve();
    }
  }, [approve]);

  // const render = useMemo(() => {
  //   if (participant?.metadata.wait_for_approval) {
  //     return (
  //       <div className='approve-btn-wrap rtl:pt-2'>
  //         <button
  //           className='rounded-lg bg-primaryColor px-2 py-[1px] text-xs text-white transition ease-in hover:bg-secondaryColor'
  //           onClick={approve}
  //         >
  //           {t('left-panel.approve')}
  //         </button>
  //         <button
  //           className='rounded-lg bg-red-600 px-2 py-[1px] text-xs text-white transition ease-in hover:bg-red-800 ltr:ml-2 rtl:mr-2'
  //           onClick={reject}
  //         >
  //           {t('left-panel.reject')}
  //         </button>
  //       </div>
  //     );
  //   }

  //   return null;
  //   //eslint-disable-next-line
  // }, [participant?.metadata.wait_for_approval]);

  // return <>{render}</>;
  return null;
};

export default WaitingApproval;
