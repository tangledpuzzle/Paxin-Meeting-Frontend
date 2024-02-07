'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

export interface UpvoteCardProps {
  upvotes: number;
  downvotes: number;
  vote: number;
  me: boolean;
  id: number;
}

function UpvoteCard({ upvotes, downvotes, vote, me, id }: UpvoteCardProps) {
  const t = useTranslations('main');

  const [isUpVoteLoading, setIsUpVoteLoading] = useState(false);
  const [isDownVoteLoading, setIsDownVoteLoading] = useState(false);

  const [numberOfUpvotes, setNumberOfUpvotes] = useState<number>(upvotes);
  const [numberOfDownvotes, setNumberOfDownvotes] = useState<number>(downvotes);

  const handleVote = async ({ id, vote }: { id: number; vote: boolean }) => {
    if (vote) setIsUpVoteLoading(true);
    else setIsDownVoteLoading(true);

    try {
      const res = await axios.post(`/api/flows/vote/${id}`, {
        vote,
      });

      if (res.status === 200) {
        toast.success(t('vote_successfully'), {
          position: 'top-right',
        });

        setNumberOfUpvotes(res.data.upvotes || 0);
        setNumberOfDownvotes(res.data.downvotes || 0);
      } else {
        toast.error(t('vote_failed'), {
          position: 'top-right',
        });
      }

      if (vote) setIsUpVoteLoading(false);
      else setIsDownVoteLoading(false);
    } catch (error) {
      const axiosError = error as AxiosError | any;

      if (axiosError.response?.status === 401) {
        toast.error(t('not_signed_in'), {
          position: 'top-right',
        });
      } else {
        toast.error(t('vote_failed'));
      }

      if (vote) setIsUpVoteLoading(false);
      else setIsDownVoteLoading(false);
    }
  };

  return (
    <div className='order-2 flex w-full flex-col justify-between gap-2 md:order-last'>
      <Card>
        <CardContent className='space-y-3 p-4'>
          <div>
            <div className='flex items-center justify-between gap-2 lowercase'>
              <div className='flex items-center text-primary'>
                <FaThumbsUp className='mr-2 size-4' />
                {t('upvotes')}
              </div>
              {numberOfUpvotes} {t('votes')}
            </div>
            <Progress
              value={
                (100 * numberOfUpvotes) / (numberOfUpvotes + numberOfDownvotes)
              }
              className='h-4 w-full'
            />
          </div>
          <div>
            <div className='flex items-center justify-between gap-2 lowercase'>
              <div className='flex items-center'>
                <FaThumbsDown className='mr-2 size-4' />
                {t('downvotes')}
              </div>
              {numberOfDownvotes} {t('votes')}
            </div>
            <Progress
              value={
                (100 * numberOfDownvotes) /
                (numberOfUpvotes + numberOfDownvotes)
              }
              className='h-4 w-full'
            />
          </div>
        </CardContent>
      </Card>
      <div className='grid w-full grid-cols-2 gap-2'>
        <Button
          className='btn btn--wide w-full'
          variant={vote === 1 ? 'default' : 'outline'}
          disabled={isUpVoteLoading || isDownVoteLoading || me}
          onClick={() => handleVote({ id: id, vote: true })}
        >
          {isUpVoteLoading ? (
            <Loader2 className='mr-2 size-4 animate-spin' />
          ) : (
            <FaThumbsUp className='mr-2 size-4' />
          )}
          {t('upvote')}
        </Button>
        <Button
          variant={vote === -1 ? 'default' : 'outline'}
          disabled={isUpVoteLoading || isDownVoteLoading || me}
          onClick={() => handleVote({ id: id, vote: false })}
        >
          {isDownVoteLoading ? (
            <Loader2 className='mr-2 size-4 animate-spin' />
          ) : (
            <FaThumbsDown className='mr-2 size-4' />
          )}
          {t('downvote')}
        </Button>
      </div>
    </div>
  );
}

export { UpvoteCard };
