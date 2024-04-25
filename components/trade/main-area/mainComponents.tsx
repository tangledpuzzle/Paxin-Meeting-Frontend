'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import type { ExcalidrawImperativeAPI } from '@excalidraw/excalidraw/types/types';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import AudioElements from '../media-elements/audios';
import SharedNotepadElement from '../shared-notepad';
// import Whiteboard from '../whiteboard';
import ExternalMediaPlayer from '../external-media-player';
import DisplayExternalLink from '../display-external-link';
import VideosComponent from '../media-elements/videos';

import {
  CurrentConnectionEvents,
  IConnectLivekit,
} from '@/helpers/livekit/types';
import {
  updateIsActiveChatPanel,
  updateIsActiveParticipantsPanel,
} from '@/store/slices/bottomIconsActivitySlice';
import SpeechToTextService from '../speech-to-text-service';

interface IMainComponentsProps {
  currentConnection: IConnectLivekit;
  isActiveExternalMediaPlayer: boolean;
  isActiveDisplayExternalLink: boolean;
}

const activateWebcamsViewSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.activateWebcamsView
);

const activateSpeechServiceSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features
      .speech_to_text_translation_features,
  (speech_to_text_translation_features) =>
    speech_to_text_translation_features?.is_enabled
);

const isActiveSharedNotepadSelector = createSelector(
  (state: RootState) =>
    state.session.currentRoom.metadata?.room_features.shared_note_pad_features,
  (shared_note_pad_features) => shared_note_pad_features?.is_active
);

const MainComponents = ({
  currentConnection,
  isActiveExternalMediaPlayer,
  isActiveDisplayExternalLink,
}: IMainComponentsProps) => {
  const dispatch = useAppDispatch();
  const isRecorder = store.getState().session.currentUser?.isRecorder;

  const activateWebcamsView = useAppSelector(activateWebcamsViewSelector);
  const activateSpeechService = useAppSelector(activateSpeechServiceSelector);
  const isActiveSharedNotepad = useAppSelector(isActiveSharedNotepadSelector);

  const [showVerticalVideoView, setShowVerticalVideoView] =
    useState<boolean>(false);
  const [hasVideoElms, setHasVideoElms] = useState<boolean>(false);
  const [showVideoElms, setShowVideoElms] = useState<boolean>(false);

  useEffect(() => {
    setHasVideoElms(currentConnection.videoSubscribersMap.size > 0);
    currentConnection.on(CurrentConnectionEvents.VideoStatus, setHasVideoElms);

    return () => {
      currentConnection.off(
        CurrentConnectionEvents.VideoStatus,
        setHasVideoElms
      );
    };
  }, [currentConnection]);

  useEffect(() => {
    if (!isActiveExternalMediaPlayer && !isActiveDisplayExternalLink) {
      setShowVerticalVideoView(false);
    } else {
      setShowVerticalVideoView(true);
    }
  }, [isActiveExternalMediaPlayer, isActiveDisplayExternalLink]);

  useEffect(() => {
    if (!activateWebcamsView) {
      setShowVideoElms(false);
      return;
    }
    setShowVideoElms(hasVideoElms);
  }, [activateWebcamsView, hasVideoElms]);

  // we can't disable to show both external player & link.
  // So, external-media-player will be first priority
  const externalMediaPlayerElm = useMemo(() => {
    let classNames = 'hidden';
    if (isActiveExternalMediaPlayer) {
      if (!isRecorder) {
        setTimeout(() => {
          dispatch(updateIsActiveChatPanel(false));
          dispatch(updateIsActiveParticipantsPanel(false));
        }, 200);
      }
      classNames =
        'Div-external-media-player w-full flex items-center justify-center';
    }

    return (
      <div className={classNames}>
        <ExternalMediaPlayer />
      </div>
    );
    //eslint-disable-next-line
  }, [isActiveExternalMediaPlayer]);

  const displayExternalLinkElm = useMemo(() => {
    let classNames = 'hidden';
    if (isActiveDisplayExternalLink) {
      if (!isRecorder) {
        setTimeout(() => {
          dispatch(updateIsActiveChatPanel(false));
          dispatch(updateIsActiveParticipantsPanel(false));
        }, 200);
      }
      classNames = 'w-full';
    }

    return (
      <div className={classNames}>
        <DisplayExternalLink />
      </div>
    );
    //eslint-disable-next-line
  }, [isActiveExternalMediaPlayer, isActiveDisplayExternalLink]);

  // this will help to reset position, if something went wrong
  const sharedNotepadElm = useMemo(() => {
    if (isActiveSharedNotepad) {
      return <SharedNotepadElement />;
    }
    return null;
  }, [isActiveSharedNotepad]);

  const cssClasses = useMemo(() => {
    const cssClasses: Array<string> = [];
    if (showVideoElms && !showVerticalVideoView) {
      cssClasses.push('h-full');
    } else if (showVideoElms && showVerticalVideoView) {
      cssClasses.push(
        'middle-fullscreen-wrapper h-full flex verticalsWebcamsActivated'
      );
    } else {
      cssClasses.push('middle-fullscreen-wrapper h-full flex');
    }

    return cssClasses.join(' ');
  }, [showVideoElms, showVerticalVideoView]);

  return (
    <>
      <div className={cssClasses}>
        {sharedNotepadElm}
        {activateWebcamsView ? (
          <VideosComponent
            currentConnection={currentConnection}
            isVertical={showVerticalVideoView}
          />
        ) : null}
        {externalMediaPlayerElm}
        {displayExternalLinkElm}
        {activateSpeechService ? (
          <SpeechToTextService currentRoom={currentConnection.room} />
        ) : null}
      </div>
      <AudioElements currentConnection={currentConnection} />
    </>
  );
};

export default MainComponents;
