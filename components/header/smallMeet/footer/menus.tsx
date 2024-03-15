import React from 'react';
import { Menu } from '@headlessui/react';

import { store } from '@/store';
import { useAppDispatch } from '@/store/hook';
import {
  updateShowKeyboardShortcutsModal,
  updateShowRoomSettingsModal,
} from '@/store/slices/roomSettingsSlice';
import { useTranslations } from 'next-intl';
import { useSession } from 'next-auth/react';

interface IHeaderMenusProps {
  onOpenAlert(task: string): void;
}

const HeaderMenus = ({ onOpenAlert }: IHeaderMenusProps) => {
  const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;
  const session = useSession();
  console.log(session);
  const dispatch = useAppDispatch();
  const t = useTranslations('meet');

  const logout = () => {
    onOpenAlert('logout');
  };
  const endRoom = () => {
    onOpenAlert('end Room');
  };
  const stepOut = () => {
    onOpenAlert('stepOut');
  };
  const showRoomSettings = () => {
    dispatch(updateShowRoomSettingsModal(true));
  };

  const showKeyboardShortcuts = () => {
    dispatch(updateShowKeyboardShortcutsModal(true));
  };

  const render = () => {
    return (
      <Menu.Items
        static
        className='HeaderSettingMenu absolute bottom-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-darkPrimary dark:ring-secondaryColor ltr:right-0 rtl:-left-4'
      >
        <div className='relative py-1' role='none'>
          <Menu.Item>
            <button
              className='group flex w-full items-center rounded px-4 py-2 text-left text-sm text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText'
              onClick={() => showRoomSettings()}
            >
              <i className='pnm-settings text-primaryColor transition ease-in group-hover:text-secondaryColor dark:text-secondaryColor dark:group-hover:text-white ltr:mr-2 rtl:ml-2' />
              {t('header.menus.settings')}
            </button>
          </Menu.Item>
        </div>
        <div className='relative py-1' role='none'>
          <Menu.Item>
            <button
              className='group flex w-full items-center rounded px-4 py-2 text-left text-sm text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText'
              onClick={() => showKeyboardShortcuts()}
            >
              <i className='pnm-keyboard text-primaryColor transition ease-in group-hover:text-secondaryColor dark:text-secondaryColor dark:group-hover:text-white ltr:mr-2 rtl:ml-2' />
              {t('header.menus.keyboard-shortcuts')}
            </button>
          </Menu.Item>
        </div>
        {session.status == 'authenticated' && (
          <div className='relative py-1' role='none'>
            <Menu.Item>
              <button
                className='group flex w-full items-center rounded px-4 py-2 text-left text-sm text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText'
                onClick={() => stepOut()}
              >
                <i className='pnm-logout text-primaryColor transition ease-in group-hover:text-secondaryColor dark:text-secondaryColor dark:group-hover:text-white ltr:mr-2 rtl:ml-2' />
                {t('header.menus.stepout')}
              </button>
            </Menu.Item>
          </div>
        )}
        <div className='relative py-1' role='none'>
          <Menu.Item>
            <button
              className='group flex w-full items-center rounded px-4 py-2 text-left text-sm text-gray-700 transition ease-in hover:text-secondaryColor dark:text-darkText'
              onClick={() => logout()}
            >
              <i className='pnm-logout text-primaryColor transition ease-in group-hover:text-secondaryColor dark:text-secondaryColor dark:group-hover:text-white ltr:mr-2 rtl:ml-2' />
              {t('header.menus.logout')}
            </button>
          </Menu.Item>
        </div>
        {isAdmin ? (
          <div className='relative py-1' role='none'>
            <Menu.Item>
              <button
                className='group flex w-full items-center rounded px-4 py-2 text-left text-sm text-red-900 transition ease-in dark:text-brandRed'
                onClick={() => endRoom()}
              >
                <i className='pnm-call text-red-900 transition ease-in dark:text-brandRed ltr:mr-2 rtl:ml-2 ' />
                {t('header.menus.end')}
              </button>
            </Menu.Item>
          </div>
        ) : null}
      </Menu.Items>
    );
  };
  return <>{render()}</>;
};

export default React.memo(HeaderMenus);
