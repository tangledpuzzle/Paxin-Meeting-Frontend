import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '@/store';



import '@/styles/meet/index.scss';

export const waitingForApprovalSelector = createSelector(
  (state: RootState) => state.session.currentUser?.metadata,
  (metadata) => metadata?.wait_for_approval
);

export const isStartupSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.isStartup
);

export const participantSelector = createSelector(
  (state: RootState) => state.participants,
  (participants) => participants.ids
);

//
