'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';

import LeftPanel from '../left-panel';
import RightPanel from '../right-panel';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import ActiveSpeakers from '../active-speakers';
import MainComponents from './mainComponents';
import { IRoomMetadata } from '@/store/slices/interfaces/session';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
import {
  CurrentConnectionEvents,
  IConnectLivekit,
} from '@/helpers/livekit/types';

interface IMainAreaProps {
  isRecorder: boolean; // it could be recorder or RTMP bot.
  currentConnection: IConnectLivekit;
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

const MainArea = ({ isRecorder, currentConnection }: IMainAreaProps) => {
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
    setIsActiveScreenShare(currentConnection.screenShareTracksMap.size > 0);
    currentConnection.on(
      CurrentConnectionEvents.ScreenShareStatus,
      setIsActiveScreenShare
    );
    return () => {
      currentConnection.off(
        CurrentConnectionEvents.ScreenShareStatus,
        setIsActiveScreenShare
      );
    };
  }, [currentConnection]);

  const customCSS = useMemo(() => {
    const css: Array<string> = [];

    css.push('showChatPanel');
    css.push('showParticipantsPanel');

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
    return <LeftPanel />;
  }, []);

  const renderMainComponentElms = useMemo(() => {
    return (
      <MainComponents
        currentConnection={currentConnection}
        isActiveExternalMediaPlayer={isActiveExternalMediaPlayer ?? false}
        isActiveDisplayExternalLink={isActiveDisplayExternalLink ?? false}
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
        <RightPanel
          currentRoom={currentConnection.room}
          isRecorder={isRecorder}
        />
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
    <div
      id='main-area'
      className={`plugNmeet-app-main-area relative mb-[0px] flex h-screen flex-col overflow-hidden lg:h-full ${customCSS} column-camera-width-${columnCameraWidth} column-camera-position-${columnCameraPosition}`}
      // style={{ height: `${height}px` }}
    >
      <div
        className={`main-app-bg pointer-events-none absolute left-0 top-0 h-full w-screen bg-cover bg-center bg-no-repeat object-cover`}
        style={{
          backgroundImage: 'url("/images/meet/app-banner.jpg")',
        }}
      />
      <div className='middle-area relative h-full w-full  md:absolute md:h-full'>
        <ActiveSpeakers />
        {renderMainComponentElms}
      </div>
      <div className='inner flex h-1/2 w-full justify-between md:h-full rtl:flex-row-reverse'>
        {renderLeftPanel}

        {renderRightPanel}
      </div>
    </div>
  );
};

export default MainArea;
