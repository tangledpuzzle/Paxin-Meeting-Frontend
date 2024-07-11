import React, { useState, useEffect } from 'react';
import { createSelector } from '@reduxjs/toolkit';

import { RootState, store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
import { IRoomMetadata } from '@/store/slices/interfaces/session';
import { useTranslations } from 'next-intl';

const isActiveChatPanelSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.isActiveChatPanel
);

const totalUnreadChatMsgsSelector = createSelector(
  (state: RootState) => state.bottomIconsActivity,
  (bottomIconsActivity) => bottomIconsActivity.totalUnreadChatMsgs
);

const ChatIcon = () => {
  const dispatch = useAppDispatch();
  const showTooltip = store.getState().session.userDeviceType === 'desktop';
  const t = useTranslations('meet');

  const isActiveChatPanel = useAppSelector(isActiveChatPanelSelector);
  const totalUnreadChatMsgs = useAppSelector(totalUnreadChatMsgsSelector);
  const [iconCSS, setIconCSS] = useState<string>('primaryColor');
  const [allowChat, setAllowChat] = useState<boolean>(true);

  useEffect(() => {
    if (isActiveChatPanel) {
      setIconCSS('secondaryColor');
    } else {
      setIconCSS('primaryColor dark:text-darkText');
    }
  }, [isActiveChatPanel]);

  useEffect(() => {
    const metadata = store.getState().session.currentRoom
      .metadata as IRoomMetadata;
    if (!metadata.room_features?.chat_features.allow_chat) {
      setAllowChat(false);
      dispatch(updateIsActiveChatPanel(false));
    }
  }, [dispatch]);

  const toggleChatPanel = () => {
    dispatch(updateIsActiveChatPanel(!isActiveChatPanel));
  };

  const render = () => {
    return (
      <div
        className={`message footer-icon relative flex size-[35px] cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] dark:bg-darkSecondary2 lg:size-[40px] ltr:mr-3 lg:ltr:mr-6 rtl:ml-3 lg:rtl:ml-6${
          showTooltip ? 'has-tooltip' : ''
        }`}
        onClick={() => toggleChatPanel()}
      >
        <span className='tooltip'>
          {isActiveChatPanel
            ? t('footer.icons.hide-chat-panel')
            : t('footer.icons.show-chat-panel')}
        </span>

        <i className={`pnm-chat ${iconCSS} text-[14px] lg:text-[16px]`} />
        {!isActiveChatPanel && totalUnreadChatMsgs > 0 ? (
          <div className='unseen-message-count absolute -right-1 -top-2 flex size-5 items-center justify-center rounded-full bg-brandRed text-xs text-white'>
            {totalUnreadChatMsgs}
          </div>
        ) : null}
      </div>
    );
  };

  return <>{allowChat ? render() : null}</>;
};

export default ChatIcon;
