import React from 'react';

import { Menu } from '@headlessui/react';
import { toast } from 'react-toastify';

import { useAppSelector } from '@/store';
import { participantsSelector } from '@/store/slices/participantSlice';
import sendAPIRequest from '@/helpers/api/plugNmeetAPI';
import {
  CommonResponse,
  SwitchPresenterReq,
  SwitchPresenterTask,
} from '@/helpers/proto/plugnmeet_common_api_pb';
import { useTranslations } from 'next-intl';

interface ISwitchPresenterMenuItemProps {
  userId: string;
}

const SwitchPresenterMenuItem = ({ userId }: ISwitchPresenterMenuItemProps) => {
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, userId)
  );
  const t = useTranslations('meet');

  const onClick = async () => {
    const body = new SwitchPresenterReq({
      userId: participant?.userId,
      task: participant?.metadata.is_presenter
        ? SwitchPresenterTask.DEMOTE
        : SwitchPresenterTask.PROMOTE,
    });

    const r = await sendAPIRequest(
      'switchPresenter',
      body.toBinary(),
      false,
      'application/protobuf',
      'arraybuffer'
    );
    const res = CommonResponse.fromBinary(new Uint8Array(r));

    if (res.status) {
      toast(t('left-panel.menus.notice.presenter-changed'), {
        toastId: 'lock-setting-status',
        type: 'info',
      });
    } else {
      // @ts-ignore
      toast(t(res.msg), {
        toastId: 'lock-setting-status',
        type: 'error',
      });
    }
  };

  const render = () => {
    return (
      <div className='' role='none'>
        <Menu.Item>
          {() => (
            <button
              className='group flex w-full items-center rounded-md px-2 py-[0.4rem] text-left text-xs text-gray-900 transition ease-in hover:bg-primaryColor hover:text-white dark:text-darkText lg:text-sm'
              onClick={() => onClick()}
            >
              {participant?.metadata.is_presenter
                ? t('footer.icons.demote-presenter')
                : t('footer.icons.promote-presenter')}
            </button>
          )}
        </Menu.Item>
      </div>
    );
  };

  return render();
};

export default SwitchPresenterMenuItem;
