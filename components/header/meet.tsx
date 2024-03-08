import React, { useEffect, useMemo, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { Transition } from '@headlessui/react';

import LeftPanel from '@/components/meet/left-panel';
import RightPanel from '@/components/meet/right-panel';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import ActiveSpeakers from '@/components/meet/active-speakers';
import MainComponents from '@/components/meet/main-area/mainComponents';
import { IRoomMetadata } from '@/store/slices/interfaces/session';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
import {
  CurrentConnectionEvents,
  IConnectLivekit,
} from '@/helpers/livekit/types';
import '@/styles/meet/index.scss';
interface IMainAreaProps {
  currentConnection: IConnectLivekit | null;
}

const columnCameraWidthSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.columnCameraWidth
);
const columnCameraPositionSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.columnCameraPosition
);
const isActiveParticipantsPanelSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.isActiveParticipantsPanel
);
const isActiveChatPanelSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.isActiveChatPanel
);
const activeScreenSharingViewSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.activeScreenSharingView
);
const isActiveWhiteboardSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.isActiveWhiteboard
);
const isActiveExternalMediaPlayerSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features
      .external_media_player_features,
  (external_media_player_features) => external_media_player_features?.is_active
);
const isActiveDisplayExternalLinkSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features
      .display_external_link_features,
  (display_external_link_features) => display_external_link_features?.is_active
);
const screenHeightSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.screenHeight
);
const headerVisibilitySelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.visibleHeader
);
const footerVisibilitySelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.visibleFooter
);
const roomSelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.currentRoom
);
export default function Meet({ currentConnection }: IMainAreaProps) {
  const isRecorder =
    currentConnection?.room.localParticipant.identity === 'RECORDER_BOT' ||
    currentConnection?.room.localParticipant.identity === 'RTMP_BOT'
      ? true
      : false;
  const columnCameraWidth = useAppSelector(columnCameraWidthSelector);
  const columnCameraPosition = useAppSelector(columnCameraPositionSelector);
  const isActiveParticipantsPanel = useAppSelector(
    isActiveParticipantsPanelSelector
  );
  const isActiveScreenSharingView = useAppSelector(
    activeScreenSharingViewSelector
  );
  const isActiveWhiteboard = useAppSelector(isActiveWhiteboardSelector);
  const isActiveExternalMediaPlayer = useAppSelector(
    isActiveExternalMediaPlayerSelector
  );
  const isActiveDisplayExternalLink = useAppSelector(
    isActiveDisplayExternalLinkSelector
  );
  const isActiveChatPanel = useAppSelector(isActiveChatPanelSelector);
  const screenHeight = useAppSelector(screenHeightSelector);
  const headerVisible = useAppSelector(headerVisibilitySelector);
  const footerVisible = useAppSelector(footerVisibilitySelector);
  const dispatch = useAppDispatch();

  const [allowChat, setAllowChat] = useState<boolean>(true);
  const [isActiveScreenShare, setIsActiveScreenShare] =
    useState<boolean>(false);
  const [height, setHeight] = useState<number>(screenHeight);

  useEffect(() => {
    const metadata = store.getState().session.currentRoom
      .metadata as IRoomMetadata;

    if (!metadata.room_features?.chat_features.allow_chat) {
      setAllowChat(false);
      dispatch(updateIsActiveChatPanel(false));
    }
  }, [dispatch]);

  useEffect(() => {
    currentConnection &&
      setIsActiveScreenShare(currentConnection.screenShareTracksMap.size > 0);
    currentConnection &&
      currentConnection.on(
        CurrentConnectionEvents.ScreenShareStatus,
        setIsActiveScreenShare
      );
    return () => {
      currentConnection &&
        currentConnection.off(
          CurrentConnectionEvents.ScreenShareStatus,
          setIsActiveScreenShare
        );
    };
  }, [currentConnection]);

  const customCSS = useMemo(() => {
    const css: Array<string> = [];

    isActiveChatPanel ? css.push('showChatPanel') : css.push('hideChatPanel');
    isActiveParticipantsPanel
      ? css.push('showParticipantsPanel')
      : css.push('hideParticipantsPanel');

    isActiveScreenSharingView && isActiveScreenShare
      ? css.push('showScreenShare fullWidthMainArea')
      : css.push('hideScreenShare');

    isActiveWhiteboard
      ? css.push('showWhiteboard fullWidthMainArea')
      : css.push('hideWhiteboard');

    isActiveExternalMediaPlayer
      ? css.push('showExternalMediaPlayer fullWidthMainArea')
      : css.push('hideExternalMediaPlayer');

    isActiveDisplayExternalLink
      ? css.push('showDisplayExternalLink fullWidthMainArea')
      : css.push('hideDisplayExternalLink');

    isRecorder ? css.push(`isRecorder`) : null;

    return css.join(' ');
  }, [
    isActiveScreenSharingView,
    isActiveScreenShare,
    isActiveChatPanel,
    isActiveParticipantsPanel,
    isActiveWhiteboard,
    isActiveExternalMediaPlayer,
    isActiveDisplayExternalLink,
    isRecorder,
  ]);

  const renderLeftPanel = useMemo(() => {
    return (
      <Transition
        className='transition-left-panel'
        show={isActiveParticipantsPanel}
        unmount={false}
        enter='transform transition duration-[400ms]'
        enterFrom='opacity-0 translate-x-0'
        enterTo='opacity-100'
        leave='transform transition duration-[400ms]'
        leaveFrom='opacity-100'
        leaveTo='opacity-0 -translate-x-full'
      >
        <LeftPanel />
      </Transition>
    );
  }, [isActiveParticipantsPanel]);

  const renderMainComponentElms = useMemo(() => {
    return (
      <MainComponents
        currentConnection={currentConnection}
        isActiveWhiteboard={isActiveWhiteboard}
        isActiveExternalMediaPlayer={isActiveExternalMediaPlayer ?? false}
        isActiveDisplayExternalLink={isActiveDisplayExternalLink ?? false}
        isActiveScreenSharingView={isActiveScreenSharingView}
      />
    );
  }, [
    isActiveScreenSharingView,
    currentConnection,
    isActiveDisplayExternalLink,
    isActiveExternalMediaPlayer,
    isActiveWhiteboard,
  ]);

  const renderRightPanel = useMemo(() => {
    if (allowChat) {
      return (
        <Transition
          className='transition-right-panel'
          show={isActiveChatPanel}
          unmount={false}
          enter='transform transition duration-[400ms]'
          enterFrom='opacity-0 translate-x-0'
          enterTo='opacity-100'
          leave='transform transition duration-[400ms]'
          leaveFrom='opacity-100'
          leaveTo='opacity-0 translate-x-full'
        >
          <RightPanel
            currentRoom={currentConnection.room}
            isRecorder={isRecorder}
          />
        </Transition>
      );
    }
    return null;
    //eslint-disable-next-line
  }, [currentConnection, isActiveChatPanel]);

  useEffect(() => {
    if (isRecorder) {
      setHeight(screenHeight);
      return;
    }
    if (headerVisible && footerVisible) {
      setHeight(screenHeight - 110);
    } else if (headerVisible && !footerVisible) {
      setHeight(screenHeight - 50);
    } else if (!headerVisible && footerVisible) {
      setHeight(screenHeight - 60);
    } else if (!headerVisible && !footerVisible) {
      setHeight(screenHeight);
    }
  }, [screenHeight, isRecorder, headerVisible, footerVisible]);

  return (
    <div className='inner flex h-[500px] justify-between rtl:flex-row-reverse'>
      {renderLeftPanel}

      <div className='middle-area relative flex-auto'>
        <ActiveSpeakers />
        {renderMainComponentElms}
      </div>

      {renderRightPanel}
    </div>
  );
}
