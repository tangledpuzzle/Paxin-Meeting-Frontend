import React, { useMemo } from 'react';
import { Tab } from '@headlessui/react';
import { createSelector } from '@reduxjs/toolkit';

import ParticipantsComponent from '../participants';
import PollsComponent from '../polls';
import { useGetPollsStatsQuery } from '@/store/services/pollsApi';
import { RootState, store, useAppDispatch, useAppSelector } from '@/store';
import { updateSelectedTabLeftPanel } from '@/store/slices/roomSettingsSlice';
import { useGetMyBreakoutRoomsQuery } from '@/store/services/breakoutRoomApi';
import MyBreakoutRooms from '../breakout-room/my/myBreakoutRooms';
import { updateIsActiveParticipantsPanel } from '@/store/slices/bottomIconsActivitySlice';
import { useTranslations } from 'next-intl';

const selectedTabLeftPanelSelector = createSelector(
  (state: RootState) => state.roomSettings,
  (roomSettings) => roomSettings.selectedTabLeftPanel
);

const LeftPanel = () => {
  const { data } = useGetPollsStatsQuery();
  const { data: myRooms } = useGetMyBreakoutRoomsQuery();
  const t = useTranslations('meet');
  const dispatch = useAppDispatch();
  const allow_polls =
    store.getState().session.currentRoom.metadata?.room_features.allow_polls;
  const selectedTabLeftPanel = useAppSelector(selectedTabLeftPanelSelector);

  const items = useMemo(() => {
    const total_running = Number(data?.stats?.totalRunning) ?? 0;
    const items = [
      {
        id: 1,
        title: <>{t('left-panel.participants-tab')}</>,
        elm: <ParticipantsComponent />,
      },
    ];
    if (allow_polls) {
      items.push({
        id: 2,
        title: (
          <>
            {t('left-panel.polls-tab')}
            {total_running > 0 ? (
              <span className='absolute -top-[7px] size-5 rounded-full bg-primaryColor text-[10px] text-white ltr:-right-5 rtl:-left-5'>
                {total_running ?? 0}
              </span>
            ) : null}
          </>
        ),
        elm: <PollsComponent />,
      });
    }

    if (myRooms?.status) {
      items.push({
        id: 3,
        title: <>{t('left-panel.breakout-room-tab')}</>,
        elm: <MyBreakoutRooms />,
      });
    }

    return items;
    //eslint-disable-next-line
  }, [data, myRooms]);

  const changeTabIndex = (i: number) => {
    dispatch(updateSelectedTabLeftPanel(i));
  };

  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  const closePanel = () => {
    dispatch(updateIsActiveParticipantsPanel(false));
  };

  return (
    <div
      id='main-left-panel'
      className='participants-wrapper multi-gradient relative left-0 top-0 z-10 h-full w-[330px]'
    >
      <div
        className='close absolute -right-[14px] top-1 z-10 hidden size-6 cursor-pointer rounded-full border border-solid border-primaryColor bg-white dark:border-darkText dark:bg-darkPrimary md:inline-block'
        onClick={closePanel}
      >
        <span className='absolute left-[2px] top-[11px] inline-block h-[1px] w-[18px] rotate-45 bg-primaryColor dark:bg-darkText'></span>
        <span className='absolute right-[2px] top-[11px] inline-block h-[1px] w-[18px] -rotate-45 bg-primaryColor dark:bg-darkText'></span>
      </div>
      <Tab.Group
        vertical
        selectedIndex={selectedTabLeftPanel}
        onChange={changeTabIndex}
      >
        <Tab.List className='flex'>
          {items.map((item) => (
            <Tab
              key={item.id}
              className={({ selected }) =>
                classNames(
                  'w-full border-b-4 border-solid py-2 text-xs font-bold leading-5 text-black transition ease-in dark:text-white',
                  selected ? 'border-[#004d90]' : 'border-[#004d90]/20'
                )
              }
            >
              <div className='name relative inline-block'>{item.title}</div>
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className='relative h-[calc(100%-45px)]'>
          {items.map((item) => (
            <Tab.Panel
              key={item.id}
              className={`${
                item.id === 2 || item.id === 3
                  ? 'polls flex h-full flex-col justify-between'
                  : 'h-full px-2 pt-2 xl:px-4 xl:pt-5'
              }`}
            >
              <>{item.elm}</>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default React.memo(LeftPanel);
