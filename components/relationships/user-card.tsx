'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { BiSolidCategory } from 'react-icons/bi';
import { LiaSmsSolid } from 'react-icons/lia';
import { MdOutlineHouseSiding } from 'react-icons/md';
import MessageForm from '../home/messsage-form';
import { FollowButtonGroup } from '../home/profile/follow-button-group';

interface UserType {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  cities: string[];
  categories: string[];
  hashtags: string[];
  country: string;
  bot: boolean;
}

interface UserCardProps {
  user: UserType;
  follow: boolean;
  mutate?: () => void;
}

export default function UserCard({ user, follow, mutate }: UserCardProps) {
  return (
    <div className='flex flex-col gap-4 border-b py-4 md:flex-row'>
      <Avatar className='size-16'>
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{getInitials(user.username || '')}</AvatarFallback>
      </Avatar>
      <div>
        <Link href='/profiles/[username]' as={`/profiles/${user.username}`}>
          @{user.username}
        </Link>
        <p className='line-clamp-2 !text-xs text-muted-foreground'>
          {user.bio}
        </p>
        <div className='flex flex-wrap gap-2'>
          {user.cities?.map((city, i) => (
            <Badge key={i} variant='outline' className='rounded-full text-xs'>
              <MdOutlineHouseSiding className='mr-1 size-4 text-gray-500 dark:text-white' />
              {city}
            </Badge>
          ))}
          {user.categories?.map((category, i) => (
            <Badge key={i} variant='outline' className='rounded-full text-xs'>
              <BiSolidCategory className='mr-1 size-4 text-gray-500 dark:text-white' />
              {category}
            </Badge>
          ))}
        </div>
      </div>
      <div className='ml-auto flex items-start justify-start gap-2'>
        <MessageForm
          user={{
            username: user.username,
            userId: user.id,
            bot: user.bot,
          }}
        >
          <Button variant='outline' className='!rounded-full' size='icon'>
            <LiaSmsSolid className='size-4' />
          </Button>
        </MessageForm>
        <FollowButtonGroup
          me={false}
          follow={follow}
          followerID={user.id}
          onChangeFollow={mutate ? () => mutate() : undefined}
        />
        {/* <Button variant='outline' size='sm' className='rounded-full'>
          {follow ? 'Unfollow' : 'Follow'}
        </Button> */}
      </div>
    </div>
  );
}
