import React, { useState, useEffect, useRef, useContext } from 'react';
import { toast } from 'react-toastify';
import sendAPIRequest from '@/helpers/api/paxMeetAPI';
import { useAppDispatch, useAppStore } from '@/store/hook';
import { addServerVersion, addToken } from '@/store/slices/sessionSlice';
import useBodyPix from '@/components/meet/virtual-background/hooks/useBodyPix';
import useKeyboardShortcuts from '@/helpers/hooks/useKeyboardShortcuts';
import useDesignCustomization from '@/helpers/hooks/useDesignCustomization';
import useWatchWindowSize from '@/helpers/hooks/useWatchWindowSize';
import useWatchVisibilityChange from '@/helpers/hooks/useWatchVisibilityChange';
import { useWindowSize } from 'react-use';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
import {
  VerifyTokenReq,
  VerifyTokenRes,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { Resizable } from 're-resizable';
import { clearAccessToken, getAccessToken } from '@/helpers/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useAppSelector } from '@/store/hook';
import { RTCContext } from '@/provider/webRTCProvider';
import { TiVideo } from 'react-icons/ti';
import Draggable, { DraggableHandle } from '../ui/draggable';
import { FullscreenIcon, Minimize2Icon, MoveIcon } from 'lucide-react';
import {
  participantSelector,
  waitingForApprovalSelector,
  isStartupSelector,
} from './meetwrapper';
import Meet from './meet';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';
import CopyClipboard from '@/components/common/copy-clipboard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Footer from './smallMeet/footer';
import AudioNotification from './smallMeet/app/audioNotification';
import type { DraggableData, DraggableEvent } from 'react-draggable';

const roomIdSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.currentRoom.room_id
);

export default function SmallMeet() {
  const participants = useAppSelector(participantSelector);
  const dispatch = useAppDispatch();

  const t = useTranslations('meet');
  const locale = useLocale();
  const toastId = useRef<string>(null);
  const store = useAppStore();
  const roomId = useAppSelector(roomIdSelector);
  const [loading, setLoading] = useState<boolean>(true);
  const { width } = useWindowSize();

  // // it could be recorder or RTMP bot
  const [isRecorder, setIsRecorder] = useState<boolean>(false);
  const [userTypeClass, setUserTypeClass] = useState('participant');
  const [accessTokenLocal, setAccessTokenLocal] = useState<string>('');
  const [accessTokenLoaded, setAccessTokenLoaded] = useState(false);
  // const [livekitInfo, setLivekitInfo] = useState<LivekitInfo>();
  const {
    showPopup,
    togglePopup,
    livekitInfo,
    setLivekitInfo,
    currentConnection,
    setCurrentConnection,
    error,
    setError,
    roomConnectionStatus,
    setRoomConnectionStatus,
    startLivekitConnection,
    popup,
    updateDimension,
    updatePosition,
  } = useContext(RTCContext);
  const waitForApproval = useAppSelector(waitingForApprovalSelector);

  // console.log('[App Store]: ', debugStore);
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

  const verifyToken = async () => {
    console.log('HEADER/VerifyToken');
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
    const token = getAccessToken();
    if (token === null) {
      setLoading(false);
      setError({
        title: t('app.token-missing-title'),
        text: t('app.token-missing-des'),
      });
    } else {
      setAccessTokenLocal(token), setAccessTokenLoaded(true);
    }
  }, []);

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

  useEffect(() => {
    (async () => {
      if (livekitInfo && !currentConnection) {
        // @ts-ignore
        console.log('HEADER/StartLivConnection');
        const newConnection = await startLivekitConnection(livekitInfo, t);
        setCurrentConnection(newConnection);
      }
    })();
  }, [livekitInfo]);
  const isMobile = width > 450 ? false : true;
  // console.log(popup);
  return currentConnection ? (
    <>
      <button onClick={togglePopup}>
        <div className='flex items-center justify-center'>
          <span className='relative -top-2 left-12 rounded-full bg-card-gradient-menu px-2 text-center text-xs'>
            {participants.length}
          </span>
          <TiVideo size={32} />
        </div>
      </button>

      {/* <Meet currentConnection={currentConnection} />; */}
      {showPopup && (
        <>
          {/* @ts-ignore */}
          <Draggable
            axis='both'
            onStop={(e: DraggableEvent, d: DraggableData) => {
              updatePosition(d.x, d.y);
            }}
            header='handle'
            handle='.handle'
            defaultClassName='fixed left-0 top-0 bg-white border-gray-500  shadow-md'
            defaultPosition={popup.position}
            //   position={null}
            scale={1}
          >
            <Resizable
              onResizeStop={(a, b, c, e) => {
                const newWidth = popup.dimension.width + e.width;
                const newHeight = popup.dimension.height + e.height;
                const maxWidth = !isMobile ? 350 : 200;
                const maxHeight = !isMobile ? 350 : 200;

                updateDimension(
                  newWidth > maxWidth ? newWidth : maxWidth,
                  newHeight > maxHeight ? newHeight : maxHeight
                );
              }}
              // size={popup.dimension}
              minWidth={!isMobile ? 350 : 200}
              minHeight={!isMobile ? 350 : 200}
              defaultSize={popup.dimension}
            >
              <div className='flex h-full w-full flex-col rounded-2xl shadow-sky-50 dark:bg-darkPrimary'>
                <div className='bg-h flex justify-between px-2 pt-2'>
                  <div className='flex w-full justify-center'>
                    {!isMobile && <p>{roomId}</p>}
                    <CopyClipboard
                      text={`https://www.paxintrade.com/meet/${roomId}`}
                    >
                      <div className='notepad my-auto inline-block h-8 w-8 items-center justify-center rounded-full px-2 py-1'>
                        <i className='pnm-notepad h-4 w-4 text-primaryColor dark:text-secondaryColor' />
                      </div>
                    </CopyClipboard>
                  </div>
                  <div className='flex items-center'>
                    <DraggableHandle>
                      <MoveIcon size={isMobile ? 24 : 32} />
                    </DraggableHandle>
                    <Link href={`/meet/${roomId}`}>
                      <FullscreenIcon size={isMobile ? 24 : 32} />
                    </Link>
                    <Minimize2Icon
                      size={isMobile ? 24 : 32}
                      onClick={togglePopup}
                    />
                  </div>
                </div>

                <div className='border-gardient-h relative w-full' />

                {currentConnection && (
                  <div className='flex h-full flex-col justify-between'>
                    <Meet currentConnection={currentConnection} />
                    <Footer
                      isMobile={isMobile}
                      currentRoom={currentConnection.room}
                      isRecorder={
                        currentConnection?.room.localParticipant.identity ===
                          'RECORDER_BOT' ||
                        currentConnection?.room.localParticipant.identity ===
                          'RTMP_BOT'
                          ? true
                          : false
                      }
                    />
                    <AudioNotification />
                  </div>
                )}
              </div>
            </Resizable>
          </Draggable>
        </>
      )}
    </>
  ) : null;
}
