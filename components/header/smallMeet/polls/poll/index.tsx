import React, { useState } from 'react';
import TotalResponses from './totalResponses';
import MyVoteStatus from './myVoteStatus';
import { store } from '@/store';
import ViewDetails from '../viewDetails';
import ViewResult from '../viewResult';
import { PollInfo } from '@/helpers/proto/plugnmeet_polls_pb';
import { useTranslations } from 'next-intl';

interface IPollPros {
  item: PollInfo;
}

const Poll = ({ item }: IPollPros) => {
  const t = useTranslations('meet');
  const isAdmin = store.getState().session.currentUser?.metadata?.is_admin;
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [viewResult, setViewResult] = useState<boolean>(false);

  return (
    <>
      <div className='poll-title text-md text-primaryColor dark:text-darkText'>
        {item.question}
      </div>
      <TotalResponses pollId={item.id} />
      <div className='status absolute left-0 top-0 rounded-br-lg bg-secondaryColor px-3 py-1 text-[10px] uppercase text-white'>
        {item.isRunning ? t('polls.poll-running') : t('polls.poll-closed')}
      </div>

      <div className='btn'>
        {item.isRunning ? <MyVoteStatus pollId={item.id} /> : null}

        {isAdmin ? (
          <button
            onClick={() => setViewDetails(true)}
            className='absolute bottom-0 right-0 rounded-tl-lg bg-primaryColor px-3 pb-[2px] pt-1 text-[10px] uppercase text-white transition ease-in hover:bg-secondaryColor'
          >
            {t('polls.view-details')}
          </button>
        ) : null}

        {!isAdmin && !item.isRunning ? (
          <button
            onClick={() => setViewResult(true)}
            className='absolute bottom-0 right-0 rounded-tl-lg bg-primaryColor px-3 pb-[2px] pt-1 text-[10px] uppercase text-white transition ease-in hover:bg-secondaryColor'
          >
            {t('polls.view-result')}
          </button>
        ) : null}
      </div>

      <>
        {isAdmin && viewDetails ? (
          <ViewDetails
            onCloseViewDetails={() => setViewDetails(false)}
            pollId={item.id}
          />
        ) : null}

        {/*only if result published*/}
        {!isAdmin && !item.isRunning && viewResult ? (
          <ViewResult
            onCloseViewResult={() => setViewResult(false)}
            pollId={item.id}
          />
        ) : null}
      </>
    </>
  );
};

export default Poll;
