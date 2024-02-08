import React, { useEffect, useState } from 'react';

import { useGetUserSelectedOptionQuery } from '@/store/services/pollsApi';
import { store } from '@/store';
import VoteForm from '../voteForm';
import { useTranslations } from 'next-intl';

interface IMyVoteStatusProps {
  pollId: string;
}
const MyVoteStatus = ({ pollId }: IMyVoteStatusProps) => {
  const t = useTranslations('meet');
  const { data, isLoading } = useGetUserSelectedOptionQuery({
    pollId,
    userId: store.getState().session.currentUser?.userId || '',
  });
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [showVoteForm, setShowVoteForm] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && data) {
      if (data.status) {
        setHasVoted(!!(data.voted && data.voted > 0));
      }
    }
  }, [data, isLoading]);

  const vote = () => {
    setShowVoteForm(true);
  };

  const onCloseForm = () => {
    setShowVoteForm(false);
  };

  return (
    <>
      <div className='has-voted'>
        {hasVoted ? (
          <p className='absolute bottom-2 left-2 text-xs dark:text-white'>
            {t('polls.you-voted')}
          </p>
        ) : (
          <button
            className='absolute bottom-0 left-0 rounded-tr-lg bg-primaryColor px-3 pb-[2px] pt-1 text-[10px] uppercase text-white transition ease-in hover:bg-secondaryColor'
            onClick={() => vote()}
          >
            {t('polls.vote')}
          </button>
        )}
      </div>
      {showVoteForm ? (
        <VoteForm onCloseForm={onCloseForm} pollId={pollId} />
      ) : null}
    </>
  );
};

export default MyVoteStatus;
