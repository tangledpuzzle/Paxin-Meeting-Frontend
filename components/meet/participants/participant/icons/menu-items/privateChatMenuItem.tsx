import React from 'react';
import { Menu } from '@headlessui/react';

import { useAppDispatch } from '@/store';
import {
  updateInitiatePrivateChat,
  updateSelectedChatOption,
} from '@/store/slices/roomSettingsSlice';
import { updateIsActiveChatPanel } from '@/store/slices/bottomIconsActivitySlice';
import { useTranslations } from 'next-intl';

interface IChatMenuItemProps {
  userId: string;
  name: string;
}
const PrivateChatMenuItem = ({ name, userId }: IChatMenuItemProps) => {
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const onClick = () => {
    dispatch(updateIsActiveChatPanel(true));
    dispatch(
      updateInitiatePrivateChat({
        name,
        userId,
      })
    );
    dispatch(updateSelectedChatOption(userId));
  };
  return (
    <div className='' role='none'>
      <Menu.Item>
        {() => (
          <button
            className='group flex w-full items-center rounded-md px-2 py-[0.4rem] text-left text-xs text-gray-900 transition ease-in hover:bg-primaryColor hover:text-white dark:text-darkText lg:text-sm'
            onClick={() => onClick()}
          >
            {t('left-panel.menus.items.private-chat')}
          </button>
        )}
      </Menu.Item>
    </div>
  );
};

export default PrivateChatMenuItem;
