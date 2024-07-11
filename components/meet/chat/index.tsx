import React, { useEffect, useState } from 'react';
import { Room } from 'livekit-client';
import { createSelector } from '@reduxjs/toolkit';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';

import { RootState, store } from '@/store';
import { useAppSelector } from '@/store/hook';
import TextBoxArea from './text-box';
import ChatTabs from './chatTabs';

interface IChatComponentProps {
  currentRoom: Room;
  isRecorder: boolean;
}

const isChatLockSelector = createSelector(
  (state: RootState) => state.session.currentUser?.metadata?.lock_settings,
  (lock_settings) => lock_settings?.lock_chat
);
const themeSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.theme
);

const ChatComponent = ({ currentRoom, isRecorder }: IChatComponentProps) => {
  const isChatLock = useAppSelector(isChatLockSelector);
  const theme = useAppSelector(themeSelector);
  const [show, setShow] = useState<boolean>(false);
  const [chosenEmoji, setChosenEmoji] = useState<string | null>(null);
  const [isOpenEmojiPanel, setIsOpenEmojiPanel] = useState(false);

  // default room lock settings
  useEffect(() => {
    const isLock =
      store.getState().session.currentRoom.metadata?.default_lock_settings
        ?.lock_chat;
    const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;

    if (isLock && !isAdmin) {
      if (isChatLock !== false) {
        setShow(false);
      }
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isRecorder) {
      setShow(false);
    }
  }, [isRecorder]);

  useEffect(() => {
    if (isRecorder) {
      return;
    }

    if (isChatLock) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [isChatLock, isRecorder]);

  const onEmojiClick = (data: EmojiClickData) => {
    setChosenEmoji(`${data.emoji}`);
  };

  const onAfterSendMessage = () => {
    if (isOpenEmojiPanel) {
      setIsOpenEmojiPanel(false);
    }
  };

  return (
    <>
      <div className='messageModule-wrapper multi-gradient relative right-0 top-0 z-10 h-[calc(100%-80px)] w-[250px] xl:w-[320px]'>
        <div className='all-MessageModule-wrap h-full'>
          <ChatTabs />
        </div>
      </div>
      {isRecorder ? (
        <div className='hiddenAnimation absolute bottom-0 z-50 h-[1px] w-[100%] bg-gradient-to-r from-primaryColor to-secondaryColor' />
      ) : null}
      {show ? (
        <>
          <div
            className={`emoji-selection-wrap fixed bottom-[120px] left-10 right-0 z-[99] w-[250px] transition ease-in md:left-auto lg:bottom-[65px] xl:w-[300px] ${
              isOpenEmojiPanel
                ? 'emoji-active pointer-events-auto visible opacity-100'
                : 'pointer-events-none invisible opacity-0'
            }`}
          >
            {isOpenEmojiPanel ? (
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                lazyLoadEmojis={true}
                theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
              />
            ) : null}
          </div>
          <div className='message-form absolute bottom-1 z-[99] w-[250px] bg-white xl:z-0 xl:w-[320px]'>
            <TextBoxArea
              currentRoom={currentRoom}
              chosenEmoji={chosenEmoji}
              onAfterSendMessage={onAfterSendMessage}
            />
            <div
              className={`emoji-picker absolute bottom-5 left-2 size-5 cursor-pointer text-secondaryColor dark:text-darkText md:-left-6${
                isOpenEmojiPanel ? 'emoji-active' : ''
              }`}
              onClick={() => setIsOpenEmojiPanel(!isOpenEmojiPanel)}
            >
              {isOpenEmojiPanel ? (
                <i className='pnm-cross' />
              ) : (
                <i className='pnm-emoji' />
              )}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default ChatComponent;
