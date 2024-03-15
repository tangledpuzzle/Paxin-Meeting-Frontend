import React, { useEffect, useState } from 'react';

import { useGetCountTotalResponsesQuery } from '@/store/services/pollsApi';
import { useTranslations } from 'next-intl';

interface ITotalResponsesProps {
  pollId: string;
}
const TotalResponses = ({ pollId }: ITotalResponsesProps) => {
  const { data, isLoading } = useGetCountTotalResponsesQuery(pollId);
  const [total, setTotal] = useState<number>(0);
  const t = useTranslations('meet');

  useEffect(() => {
    if (!isLoading && data) {
      if (data.status) {
        setTotal(Number(data.totalResponses) ?? 0);
      }
    }
  }, [data, isLoading]);

  return (
    <div className='total-vote absolute right-0 top-0 rounded-bl-lg bg-secondaryColor px-3 py-1 text-[10px] uppercase text-white'>
      <strong>{t('polls.total')}: </strong> {total}
    </div>
  );
};

export default TotalResponses;
