'use client';

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import { usePathname } from 'next/navigation';
// import { useTranslation } from 'react-i18next';
import { createSelector } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import ErrorPage from '../extra-pages/Error';
import Loading from '../extra-pages/Loading';
import Footer from '../footer';
// import Header from '../header';
import MainArea from '../main-area';

import sendAPIRequest, { joinRoom } from '@/helpers/api/paxMeetAPI';
import { RootState } from '@/store';
import { useAppDispatch, useAppSelector, useAppStore } from '@/store/hook';
import {
  addServerVersion,
  addToken,
  clearToken,
  // clearToken,
} from '@/store/slices/sessionSlice';
import StartupJoinModal from './joinModal';
import AudioNotification from './audioNotification';
import useBodyPix from '../virtual-background/hooks/useBodyPix';
import useKeyboardShortcuts from '@/helpers/hooks/useKeyboardShortcuts';
import useDesignCustomization from '@/helpers/hooks/useDesignCustomization';
import useWatchWindowSize from '@/helpers/hooks/useWatchWindowSize';
import useWatchVisibilityChange from '@/helpers/hooks/useWatchVisibilityChange';
import WaitingRoomPage from '../waiting-room/room-page';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
// import useThemeSettings from '@/helpers/hooks/useThemeSettings';
import {
  VerifyTokenReq,
  VerifyTokenRes,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import {
  clearAccessToken,
  getAccessToken,
  getMeetId,
  setAccessToken,
  setMeetingId,
} from '@/helpers/utils';
import { useLocale, useTranslations } from 'next-intl';

import '@/styles/meet/index.scss';
import { getDirectionBasedOnLocale } from '@/helpers/languages';
import type { Locale } from '@/helpers/languages';
import { generateRandomString, hashTimestamp } from '@/lib/utils';
import { RTCContext } from '@/provider/webRTCProvider';

const debugSelector = createSelector(
  (state: RootState) => state,
  (e) => e
);

const waitingForApprovalSelector = createSelector(
  (state: RootState) => state.session.currentUser?.metadata,
  (metadata) => metadata?.wait_for_approval
);

const isStartupSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.isStartup
);

type MeetProps = {
  roomId: string;
};

const Meet: React.FC<MeetProps> = ({ roomId }) => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');
  const locale = useLocale();
  document.dir = getDirectionBasedOnLocale(locale as Locale);
  // // make sure we're using correct body dir
  // // document.dir = i18n.dir();
  const debugStore = useAppSelector(debugSelector);
  const toastId = useRef<string>(null);
  const store = useAppStore();

  const [loading, setLoading] = useState<boolean>(true);
  // // it could be recorder or RTMP bot
  const [isRecorder, setIsRecorder] = useState<boolean>(false);
  const [userTypeClass, setUserTypeClass] = useState('participant');
  const [accessTokenLocal, setAccessTokenLocal] = useState('');
  const [accessTokenLoaded, setAccessTokenLoaded] = useState(false);
  // const [livekitInfo, setLivekitInfo] = useState<LivekitInfo>();
  const {
    livekitInfo,
    setLivekitInfo,
    currentConnection,
    setCurrentConnection,
    error,
    setError,
    roomConnectionStatus,
    setRoomConnectionStatus,
    startLivekitConnection,
  } = useContext(RTCContext);
  const waitForApproval = useAppSelector(waitingForApprovalSelector);
  const pathname = usePathname();

  console.log('[App Store]: ', debugStore);
  // // we'll require making ready virtual background
  // // elements as early as possible.
  useBodyPix();
  const isStartup = useAppSelector(isStartupSelector);
  // // some custom hooks

  useKeyboardShortcuts(currentConnection?.room);
  useDesignCustomization();
  useWatchVisibilityChange();
  const { deviceClass, orientationClass } = useWatchWindowSize(
    currentConnection?.room
  );

  const getMeetAccessToken = async (): Promise<string> => {
    console.log('MEET/getMeetAccessToken');
    const accessToken = getAccessToken();
    if (accessToken) return accessToken;
    const randomPart = generateRandomString(4);
    const timestampHash = hashTimestamp(Date.now());
    const userId = `user-${randomPart}-${timestampHash}`;
    const userName = `User ${randomPart}`;
    const userEmail = `${randomPart}-${timestampHash}@test.me`;
    setLoading(true);
    const token = await joinRoom(roomId, userId, userName);
    console.log('JOIN TOKEN: ', token);
    setAccessToken(token);
    setLoading(false);
    if (token) {
      return token;
    } else return '';
  };

  const verifyToken = async () => {
    console.log('[Meet] Verify token');
    let res: VerifyTokenRes;
    try {
      const isProductionStr = process.env.NEXT_PUBLIC_IS_PRODUCTION;
      const isProduction: boolean | undefined =
        isProductionStr === 'true'
          ? true
          : isProductionStr === 'false'
            ? false
            : undefined;
      const reqObj = new VerifyTokenReq({
        isProduction,
      });
      const r = await sendAPIRequest(
        'verifyToken',
        reqObj.toBinary(),
        false,
        'application/protobuf',
        'arraybuffer'
      );
      res = VerifyTokenRes.fromBinary(new Uint8Array(r));
    } catch (error: any) {
      clearAccessToken();
      setAccessTokenLoaded(false);
      // console.error(error);
      // setRoomConnectionStatus('ready');
      // setLoading(false);
      // setError({
      //   title: t('app.verification-failed-title'),
      //   text: t('app.token-not-valid'),
      // });
      // clearAccessToken();
      return;
    }

    setRoomConnectionStatus('ready');
    setLoading(false);
    if (res.status && res.livekitHost && res.token) {
      // we'll store token that we received from URL
      dispatch(addToken(accessTokenLocal));
      dispatch(addServerVersion(res.serverVersion ?? ''));

      // for livekit need to use generated token & host
      console.log('MEET/setLivekitInfo', res.token);
      setLivekitInfo({
        livekit_host: res.livekitHost,
        token: res.token,
        enabledE2EE: res.enabledE2ee,
      });
    } else {
      clearAccessToken();
      setAccessTokenLoaded(false);
      // setError({
      //   title: t('app.verification-failed-title'),
      //   //@ts-ignore
      //   text: t(res.msg),
      // });
    }
  };

  useEffect(() => {
    const prevMeetId = getMeetId();
    if (prevMeetId && prevMeetId !== roomId) {
      // In this case we clear localstoreage
      console.log('MEET/Already Existing session');
      clearToken();
    }
  }, []);

  useEffect(() => {
    if (!accessTokenLoaded) {
      getMeetAccessToken().then((token) => {
        if (token === '') {
          setLoading(false);
          setError({
            title: t('app.token-missing-title'),
            text: t('app.token-missing-des'),
          });
        } else {
          error && setError(undefined);
          setAccessTokenLocal(token), setAccessTokenLoaded(true);
        }
      });
    }
  }, [pathname, accessTokenLoaded]);

  // useEffect(() => {
  //   if (accessTokenLoaded && !accessTokenLocal) {
  //     setLoading(false);
  //     setError({
  //       title: t('app.token-missing-title'),
  //       text: t('app.token-missing-des'),
  //     });
  //   }
  // }, [accessTokenLocal, accessTokenLoaded]);

  useEffect(() => {
    if (
      window.location.protocol === 'http:' &&
      window.location.hostname !== 'localhost'
    ) {
      setLoading(false);
      setError({
        title: t('app.require-ssl-title'),
        text: t('app.require-ssl-des'),
      });
    }
  }, []);

  useEffect(() => {
    if (accessTokenLoaded && accessTokenLocal) {
      let timeout: any;
      if (!currentConnection && roomConnectionStatus !== 'connected') {
        setRoomConnectionStatus('checking');
        timeout = setTimeout(() => {
          verifyToken();
        }, 300);
      }
      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [
    accessTokenLocal,
    accessTokenLoaded,
    currentConnection,
    setRoomConnectionStatus,
  ]);

  useEffect(() => {
    if (
      roomConnectionStatus === 'connecting' ||
      roomConnectionStatus === 'checking'
    ) {
      setLoading(true);
    } else if (roomConnectionStatus === 're-connecting') {
      //eslint-disable-next-line
      // @ts-ignore
      toastId.current = toast.loading(
        t('notifications.room-disconnected-reconnecting'),
        {
          type: toast.TYPE.WARNING,
          closeButton: false,
          autoClose: false,
        }
      );
    } else {
      setLoading(false);
      if (toastId.current) {
        toast.dismiss(toastId.current);
      }
    }
    //eslint-disable-next-line
  }, [roomConnectionStatus]);

  useEffect(() => {
    if (roomConnectionStatus === 'connected') {
      if (
        currentConnection?.room.localParticipant.identity === 'RECORDER_BOT' ||
        currentConnection?.room.localParticipant.identity === 'RTMP_BOT'
      ) {
        setIsRecorder(true);
        dispatch(updateIsActiveChatPanel(false));
      }

      if (store.getState().session.currentUser?.metadata?.is_admin) {
        setUserTypeClass('admin');
      }
    }
    //eslint-disable-next-line
  }, [roomConnectionStatus]);

  const renderMainApp = useCallback(() => {
    if (currentConnection) {
      return (
        <div className='plugNmeet-app flex h-full flex-col justify-between  overflow-x-hidden'>
          {/* {!isRecorder ? <Header currentRoom={currentConnection.room} /> : null} */}
          <MainArea
            isRecorder={isRecorder}
            currentConnection={currentConnection}
          />
          <Footer
            currentRoom={currentConnection.room}
            isRecorder={isRecorder}
          />
          <AudioNotification />
        </div>
      );
    }
    return null;
  }, [isRecorder, currentConnection]);

  const onCloseStartupModal = async () => {
    if (livekitInfo) {
      console.log('MEET/StartLiveConnection');
      // @ts-ignore
      const currentConnection = startLivekitConnection(livekitInfo, t);
      setCurrentConnection(currentConnection);
      setMeetingId(roomId);
    }
  };

  const renderElms = useMemo(() => {
    if (loading) {
      // @ts-ignore
      return <Loading text={t('app.' + roomConnectionStatus)} />;
    } else if (error && !loading) {
      return <ErrorPage title={error.title} text={error.text} />;
    } else if (
      roomConnectionStatus === 'connected' ||
      roomConnectionStatus === 're-connecting'
    ) {
      if (waitForApproval) {
        return <WaitingRoomPage />;
      }
      return renderMainApp();
    } else if (roomConnectionStatus === 'ready') {
      return <StartupJoinModal onCloseModal={onCloseStartupModal} />;
    } else {
      return null;
    }
    //eslint-disable-next-line
  }, [loading, error, roomConnectionStatus, waitForApproval, renderMainApp]);
  console.log('[Status]', roomConnectionStatus, isStartup, error);
  return (
    <div
      className={`${orientationClass} ${deviceClass} ${userTypeClass} h-[calc(100vh-129px)] dark:bg-darkPrimary/70 sm:h-[calc(100vh-80px)]`}
      // style={{ height: screenHeight }}
    >
      {renderElms}
    </div>
  );
};

export default Meet;
