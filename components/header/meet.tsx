import React, { useEffect, useMemo, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
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
  currentConnection: IConnectLivekit;
}

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

export default function Meet({ currentConnection }: IMainAreaProps) {
  const isRecorder =
    currentConnection?.room.localParticipant.identity === 'RECORDER_BOT' ||
    currentConnection?.room.localParticipant.identity === 'RTMP_BOT'
      ? true
      : false;

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

  const screenHeight = useAppSelector(screenHeightSelector);
  const headerVisible = useAppSelector(headerVisibilitySelector);
  const footerVisible = useAppSelector(footerVisibilitySelector);
  const dispatch = useAppDispatch();

  const [, setAllowChat] = useState<boolean>(true);
  const [, setIsActiveScreenShare] =
    useState<boolean>(false);
  const [, setHeight] = useState<number>(screenHeight);

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
    <div className='inner flex h-full justify-between rtl:flex-row-reverse'>
      <div className='relative flex-auto'>
        <ActiveSpeakers />
        {renderMainComponentElms}
      </div>
    </div>
  );
}
