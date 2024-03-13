import { useCallback, useMemo } from 'react';
import Meet from './meet';
// import { useTranslation } from 'react-i18next';
import { createSelector } from '@reduxjs/toolkit';
// import ErrorPage from '../extra-pages/Error';
// import Loading from '../extra-pages/Loading';
// import Footer from '../footer';
// import Header from '../header';

import { joinRoom } from '@/helpers/api/paxMeetAPI';
import { RootState } from '@/store';
import useLivekitConnect, {
  LivekitInfo,
} from '@/helpers/livekit/hooks/useLivekitConnect';
import AudioNotification from '@/components/meet/app/audioNotification';

// import useThemeSettings from '@/helpers/hooks/useThemeSettings';
import { IConnectLivekit } from '@/helpers/livekit/types';
import { setAccessToken } from '@/helpers/utils';

import '@/styles/meet/index.scss';
import { getDirectionBasedOnLocale } from '@/helpers/languages';
import type { Locale } from '@/helpers/languages';
import { generateRandomString, hashTimestamp } from '@/lib/utils';

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
