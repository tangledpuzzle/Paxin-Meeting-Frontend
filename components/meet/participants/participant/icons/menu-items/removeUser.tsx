import React from 'react';
import { Menu } from '@headlessui/react';
import { useTranslations } from 'next-intl';

interface IRemoveUserMenuItemProps {
  userId: string;
  onOpenAlert(userId: string, type: string): void;
}

const RemoveUserMenuItem = ({
  userId,
  onOpenAlert,
}: IRemoveUserMenuItemProps) => {
  const t = useTranslations('meet');

  const onClose = () => {
    onOpenAlert(userId, 'remove');
  };

  const render = () => {
    return (
      <>
        <div className='' role='none'>
          <Menu.Item>
            {() => (
              <button
                className='group flex w-full items-center rounded-md px-2 py-[0.4rem] text-left text-xs text-red-900 transition ease-in hover:bg-red-400 hover:text-white lg:text-sm'
                onClick={() => onClose()}
              >
                {t('left-panel.menus.items.remove-participant')}
              </button>
            )}
          </Menu.Item>
        </div>
      </>
    );
  };
  return <>{render()}</>;
};

export default RemoveUserMenuItem;
