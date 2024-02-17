import React, { useState, useEffect } from 'react';
import { Popover } from '@headlessui/react';

import PopoverPanelElms from './popoverPanelElms';
import { store } from '@/store';
import { useTranslations } from 'next-intl';

interface SubtitleTextsHistoryProps {
  isOpenPopover: (open: boolean) => void;
}

const SubtitleTextsHistory = ({ isOpenPopover }: SubtitleTextsHistoryProps) => {
  const t = useTranslations('meet');
  const [showPopover, setShowPopover] = useState<boolean>(false);

  useEffect(() => {
    const isRecorder = store.getState().session.currentUser?.isRecorder;
    if (!isRecorder) {
      setShowPopover(true);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    isOpenPopover(showPopover);
    //eslint-disable-next-line
  }, [showPopover]);

  return (
    <Popover className='subtitleTextsHistory relative'>
      <button
        className='absolute bottom-1 left-[2.7rem] lg:left-[3.1rem]'
        onClick={() => setShowPopover(!showPopover)}
      >
        <div className='microphone footer-icon has-tooltip relative flex h-[35px] w-[35px] cursor-pointer items-center justify-center rounded-full bg-[#F2F2F2] hover:bg-[#ECF4FF] dark:bg-darkSecondary2 lg:h-[40px] lg:w-[40px]'>
          <span className='tooltip'>
            {t('speech-services.subtitle-history-modal-title')}
          </span>
          <i
            className={`pnm-timeline-solid text-[12px] dark:text-darkText lg:text-[14px] ${
              showPopover ? 'secondaryColor' : 'primaryColor'
            }`}
          ></i>
        </div>
      </button>
      {showPopover ? (
        <PopoverPanelElms
          setShowPopover={setShowPopover}
          showPopover={showPopover}
        />
      ) : null}
    </Popover>
  );
};

export default SubtitleTextsHistory;
