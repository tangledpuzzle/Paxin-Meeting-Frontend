import React, { useState, useEffect } from 'react';
import { createSelector } from '@reduxjs/toolkit';

import { useAppSelector, RootState, useAppDispatch, store } from '@/store';
import { updateIsActiveParticipantsPanel } from '@/store/slices/bottomIconsActivitySlice';
import { participantsSelector } from '@/store/slices/participantSlice';
import { useTranslations } from 'next-intl';

const isActiveParticipantsPanelSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.isActiveParticipantsPanel
);

const ParticipantIcon = () => {
  const dispatch = useAppDispatch();
  const showTooltip = store.getState().session.userDeviceType === 'desktop';
  const t = useTranslations('meet');

  const isActiveParticipantsPanel = useAppSelector(
    isActiveParticipantsPanelSelector
  );
  const participantsTotal = useAppSelector(participantsSelector.selectTotal);
  const [iconCSS, setIconCSS] = useState<string>('primaryColor');

  useEffect(() => {
    if (isActiveParticipantsPanel) {
      setIconCSS('secondaryColor');
    } else {
      setIconCSS('primaryColor dark:text-darkText');
    }
  }, [isActiveParticipantsPanel]);

  const toggleParticipantsPanel = () => {
    dispatch(updateIsActiveParticipantsPanel(!isActiveParticipantsPanel));
  };

  return (
    <div
      className={`participants footer-icon relative flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] dark:bg-darkSecondary2 lg:h-[40px] lg:w-[40px] ltr:mr-3 lg:ltr:mr-6 rtl:ml-3 lg:rtl:ml-6 ${
        showTooltip ? 'has-tooltip' : ''
      }`}
      onClick={() => toggleParticipantsPanel()}
    >
      <span className='tooltip'>
        {isActiveParticipantsPanel
          ? t('footer.icons.hide-users-list')
          : t('footer.icons.show-users-list')}
      </span>

      <i className={`pnm-participant ${iconCSS} text-[14px] lg:text-[16px]`} />
      {!isActiveParticipantsPanel ? (
        <div className='unseen-message-count absolute -right-1 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondaryColor text-xs text-white'>
          {participantsTotal}
        </div>
      ) : null}
    </div>
  );
};

export default ParticipantIcon;
