import React, { useEffect, useState } from 'react';
import useVirtual from 'react-cool-virtual';

import { useGetPollListsQuery } from '@/store/services/pollsApi';
import Poll from './poll';
import { PollInfo } from '@/helpers/proto/plugnmeet_polls_pb';


const ListPolls = () => {
  const { data, isLoading } = useGetPollListsQuery();
  const [polls, setPolls] = useState<PollInfo[]>([]);
  const { outerRef, innerRef, items } = useVirtual({
    itemCount: polls.length,
  });

  useEffect(() => {
    if (data && data.polls) {
      const sortedPolls = data.polls.slice();
      sortedPolls.sort((a, b) => Number(b.created) - Number(a.created));
      setPolls(sortedPolls);
    }
  }, [data]);

  const renderPoll = (index: number) => {
    if (!polls.length || typeof polls[index] === 'undefined') {
      return null;
    }
    const poll = polls[index];
    return <Poll key={poll.id} item={poll} />;
  };

  return (
    <div
      className='polls-list-wrapper scrollBar relative h-full overflow-auto px-2 pt-2 xl:pt-3'
      ref={outerRef as any}
    >
      <div className='polls-list-wrap-inner' ref={innerRef as any}>
        {items.map(({ index, measureRef }) => (
          <div
            key={index}
            ref={measureRef}
            className='poll-item relative mb-4 overflow-hidden rounded-lg border border-solid border-primaryColor/70 px-2 py-8 transition ease-in hover:shadow-md'
          >
            {renderPoll(index)}
          </div>
        ))}
        {isLoading ? (
          <div className='loading absolute inset-x-0 top-1/2 z-[999] m-auto -translate-y-1/2 text-center'>
            <div className='lds-ripple'>
              <div className='border-secondaryColor' />
              <div className='border-secondaryColor' />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ListPolls;
