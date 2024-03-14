'use client';

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import toast from 'react-hot-toast';

export interface FollowButtonGroupProps {
  me: boolean;
  follow: boolean;
  followerID: string;
  onChangeFollow?: () => void;
}

function FollowButtonGroup({
  me,
  follow,
  followerID,
  onChangeFollow,
}: FollowButtonGroupProps) {
  const t = useTranslations('main');
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isFollowable, setIsFollowable] = useState(!follow);

  const handleFollow = async () => {
    setIsFollowLoading(true);

    try {
      const res = await axios.post(
        '/api/profiles/follow/',
        {
          followerID: followerID,
        },
        {
          headers: {
            type: 'scribe',
          },
        }
      );

      if (res.status === 200) {
        toast.success(t('follow_success'), {
          position: 'top-right',
        });

        setIsFollowable(false);

        onChangeFollow && onChangeFollow();
      } else {
        toast.error(t('follow_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('follow_failed'), {
        position: 'top-right',
      });
    }

    setIsFollowLoading(false);
  };

  const handleUnFollow = async () => {
    setIsFollowLoading(true);

    try {
      const res = await axios.post('/api/profiles/follow/', {
        followerID: followerID,
      });

      if (res.status === 200) {
        toast.success(t('unfollow_success'), {
          position: 'top-right',
        });

        setIsFollowable(true);

        onChangeFollow && onChangeFollow();
      } else {
        toast.error(t('unfollow_failed'), {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error(t('unfollow_failed'), {
        position: 'top-right',
      });
    }

    setIsFollowLoading(false);
  };

  return (
    <>
      {isFollowable ? (
        <Button
          className='btn btn--wide !my-0 !mr-0 ml-auto !rounded-md'
          disabled={isFollowLoading || me}
          size='sm'
          onClick={handleFollow}
        >
          {isFollowLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
          {t('follow')}
        </Button>
      ) : (
        <Button
          variant='outline'
          className='ml-auto !rounded-md'
          disabled={isFollowLoading}
          size='sm'
          onClick={handleUnFollow}
        >
          {isFollowLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
          {t('unfollow')}
        </Button>
      )}
    </>
  );
}

export { FollowButtonGroup };
