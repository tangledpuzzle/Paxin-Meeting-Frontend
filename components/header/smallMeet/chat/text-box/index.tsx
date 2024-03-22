import React, { useCallback, useEffect, useState } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import sanitizeHtml from 'sanitize-html';
import { Room } from 'livekit-client';
import { isEmpty } from 'validator';

import { RootState, store } from '@/store';
import { useAppSelector } from '@/store/hook';
import { isSocketConnected, sendWebsocketMessage } from '@/helpers/websocket';
import { IRoomMetadata } from '@/store/slices/interfaces/session';
import FileSend from './fileSend';
import {
  DataMessage,
  DataMsgBodyType,
  DataMsgType,
} from '@/helpers/proto/plugnmeet_datamessage_pb';
import { useTranslations } from 'next-intl';

interface ITextBoxAreaProps {
  currentRoom: Room;
  chosenEmoji: string | null;
  onAfterSendMessage(): void;
}
const isChatServiceReadySelector = createSelector(
  (state: RootState) => state.session,
  (session) => session.isChatServiceReady
);

const isLockChatSendMsgSelector = createSelector(
  (state: RootState) => state.session.currentUser?.metadata?.lock_settings,
  (lock_settings) => lock_settings?.lock_chat_send_message
);

const isLockSendFileSelector = createSelector(
  (state: RootState) => state.session.currentUser?.metadata?.lock_settings,
  (lock_settings) => lock_settings?.lock_chat_file_share
);

const selectedChatOptionSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.selectedChatOption
);

const TextBoxArea = ({
  currentRoom,
  chosenEmoji,
  onAfterSendMessage,
}: ITextBoxAreaProps) => {
  const isChatServiceReady = useAppSelector(isChatServiceReadySelector);
  const isLockChatSendMsg = useAppSelector(isLockChatSendMsgSelector);
  const isLockSendFile = useAppSelector(isLockSendFileSelector);
  const selectedChatOption = useAppSelector(selectedChatOptionSelector);
  const t = useTranslations('meet');

  const [lockSendMsg, setLockSendMsg] = useState<boolean>(false);
  const [lockSendFile, setLockSendFile] = useState<boolean>(false);
  const [showSendFile, setShowSendFile] = useState<boolean>(true);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const metadata = store.getState().session.currentRoom
      .metadata as IRoomMetadata;

    if (!metadata.room_features.chat_features.allow_file_upload) {
      setShowSendFile(false);
    }
  }, []);

  useEffect(() => {
    if (isLockChatSendMsg) {
      setLockSendMsg(true);
    } else {
      setLockSendMsg(false);
    }
    if (isLockSendFile) {
      setLockSendFile(true);
    } else {
      setLockSendFile(false);
    }
  }, [isLockChatSendMsg, isLockSendFile]);

  // default room lock settings
  useEffect(() => {
    const lock_chat_send_message =
      store.getState().session.currentRoom.metadata?.default_lock_settings
        ?.lock_chat_send_message;
    const lock_chat_file_share =
      store.getState().session.currentRoom.metadata?.default_lock_settings
        ?.lock_chat_file_share;

    const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;

    if (lock_chat_send_message && !isAdmin) {
      if (isLockChatSendMsg !== false) {
        setLockSendMsg(true);
      }
    }
    if (lock_chat_file_share && !isAdmin) {
      if (isLockChatSendMsg !== false) {
        setLockSendFile(true);
      }
    }
    // eslint-disable-next-line
  }, []);

  const addEmoji = useCallback(
    (emoji: string) => {
      const msg = message + emoji;
      setMessage(msg);
    },
    [message]
  );

  useEffect(() => {
    if (chosenEmoji) {
      addEmoji(chosenEmoji);
    }
    //eslint-disable-next-line
  }, [chosenEmoji]);

  const cleanHtml = (rawText: string) => {
    return sanitizeHtml(rawText, {
      allowedTags: ['b', 'i', 'strong', 'br'],
      allowedSchemes: ['mailto', 'tel'],
    });
  };

  const sendMsg = async () => {
    const msg = cleanHtml(message);
    if (isEmpty(msg)) {
      return;
    }

    let sid = await currentRoom.getSid()


    const dataMsg = new DataMessage({
      type: DataMsgType.USER,
      roomSid: sid,
      roomId: currentRoom.name,
      to: selectedChatOption !== 'public' ? selectedChatOption : '',
      body: {
        type: DataMsgBodyType.CHAT,
        isPrivate: selectedChatOption !== 'public' ? 1 : 0,
        from: {
          sid: currentRoom.localParticipant.sid,
          userId: currentRoom.localParticipant.identity,
          name: currentRoom.localParticipant.name,
        },
        msg: msg.replace(/\r?\n/g, '<br />'),
      },
    });

    if (isSocketConnected()) {
      sendWebsocketMessage(dataMsg.toBinary(), t);
      setMessage('');
    }
    onAfterSendMessage();
  };

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      sendMsg();
    }
  };

  return (
    <>
      <div className='flex h-[4.5rem] items-start justify-between p-2 pl-10 md:pl-0'>
        <textarea
          name='message-textarea'
          id='message-textarea'
          className='primaryColor mt-1 h-14 max-h-14 w-full rounded-xl bg-white px-4 py-2 text-xs leading-[1.2] outline-none placeholder:text-primaryColor/70 dark:bg-darkSecondary2 dark:text-white dark:placeholder:text-white/70 lg:text-sm'
          value={message}
          onChange={(e) => setMessage(e.currentTarget.value)}
          disabled={!isChatServiceReady || lockSendMsg}
          placeholder={t('right-panel.chat-box-placeholder').toString()}
          onKeyDown={(e) => onEnterPress(e)}
        />
        <div className='btns'>
          <button
            disabled={!isChatServiceReady || lockSendMsg}
            onClick={() => sendMsg()}
            className='h-6 w-4 p-2'
          >
            <i className='pnm-send primaryColor text-[20px] dark:text-secondaryColor' />
          </button>

          {showSendFile ? (
            <FileSend
              isChatServiceReady={isChatServiceReady}
              lockSendFile={lockSendFile}
              currentRoom={currentRoom}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default TextBoxArea;
