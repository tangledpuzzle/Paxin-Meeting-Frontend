import React from 'react';
import { useAppDispatch } from '@/store';
import { updateIsActiveParticipantsPanel } from '@/store/slices/bottomIconsActivitySlice';
import { updateSelectedTabLeftPanel } from '@/store/slices/roomSettingsSlice';
import { useTranslations } from 'next-intl';

interface INewPollMsgProps {
  closeToast?(): void;
}

const NewPollMsg = ({ closeToast }: INewPollMsgProps) => {
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();

  const openPoll = () => {
    dispatch(updateIsActiveParticipantsPanel(true));
    dispatch(updateSelectedTabLeftPanel(1));
    if (closeToast) {
      closeToast();
    }
  };
  return (
    <>
      <span className='text-black dark:text-darkText'>
        {t('polls.new-poll')}
      </span>
      <div className='button-section flex items-center justify-start'>
        <button
          className='mt-1 rounded-lg bg-primaryColor px-3 py-1 text-center text-xs font-semibold text-white transition ease-in hover:bg-secondaryColor'
          onClick={openPoll}
        >
          {t('open')}
        </button>
      </div>
    </>
  );
};

export default NewPollMsg;
