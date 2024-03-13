import React, { useEffect, useState } from 'react';
import useVirtual from 'react-cool-virtual';
import { createSelector } from '@reduxjs/toolkit';

import { RootState, store } from '@/store';
import { useAppSelector } from '@/store/hook';
import ParticipantComponent from './participant';
import { participantsSelector } from '@/store/slices/participantSlice';
import { IParticipant } from '@/store/slices/interfaces/participant';
import RemoveParticipantAlertModal, {
  IRemoveParticipantAlertModalData,
} from './removeParticipantAlertModal';
import { useTranslations } from 'next-intl';

const screenHeightSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.screenHeight
);

const ParticipantsComponent = () => {
  const t = useTranslations('meet');
  const allParticipants = useAppSelector(participantsSelector.selectAll);
  const screenHeight = useAppSelector(screenHeightSelector);

  const [participants, setParticipants] = useState<IParticipant[]>([]);
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: participants.length,
  });

  const [removeParticipantData, setRemoveParticipantData] =
    useState<IRemoveParticipantAlertModalData>();

  const session = store.getState().session;
  const currentUserUserId = session.currentUser?.userId;
  const allow_view_other_users_list =
    session.currentRoom.metadata?.room_features?.allow_view_other_users_list ??
    false;
  const currentIsAdmin = session.currentUser?.metadata?.is_admin ?? false;

  useEffect(() => {
    if (!allParticipants) {
      return;
    }
    setParticipants(
      allParticipants.filter(
        (p) =>
          p.name !== '' &&
          p.userId !== 'RECORDER_BOT' &&
          p.userId !== 'RTMP_BOT'
      )
    );
  }, [allParticipants]);

  const onOpenRemoveParticipantAlert = (
    name: string,
    user_id: string,
    type: string
  ) => {
    setRemoveParticipantData({
      name,
      userId: user_id,
      removeType: type,
    });
  };

  const onCloseAlertModal = () => {
    setRemoveParticipantData(undefined);
  };

  const renderParticipant = (index: number) => {
    if (!participants.length || typeof participants[index] === 'undefined') {
      return null;
    }
    const participant = participants[index];
    const isRemoteParticipant = currentUserUserId !== participant.userId;
    if (!currentIsAdmin && !allow_view_other_users_list) {
      if (
        !participant.metadata.is_admin &&
        currentUserUserId !== participant.userId
      ) {
        return null;
      }
    }

    return (
      <ParticipantComponent
        key={participant.sid}
        participant={participant}
        isRemoteParticipant={isRemoteParticipant}
        openRemoveParticipantAlert={onOpenRemoveParticipantAlert}
      />
    );
  };

  return (
    <>
      <div className='inner-wrapper relative z-20'>
        <div className='top mb-3 flex items-center justify-between font-medium xl:mb-5'>
          <p className='text-sm text-black dark:text-white'>
            {t('left-panel.participants', {
              total: participants.length,
            })}
          </p>
        </div>

        <div
          ref={outerRef as any}
          style={{ height: screenHeight - 215, overflow: 'auto' }}
          className='scrollBar -mx-2 xl:-mx-4'
        >
          <div
            className='all-participants-wrap px-2 xl:px-4'
            ref={innerRef as any}
          >
            {items.map(({ index, measureRef }) => (
              <li
                key={index}
                ref={measureRef}
                className='mb-3 w-full list-none'
              >
                {renderParticipant(index)}
              </li>
            ))}
          </div>
        </div>
      </div>

      {removeParticipantData ? (
        <RemoveParticipantAlertModal
          name={removeParticipantData.name}
          userId={removeParticipantData.userId}
          removeType={removeParticipantData.removeType}
          closeAlertModal={onCloseAlertModal}
        />
      ) : null}
    </>
  );
};

export default ParticipantsComponent;
