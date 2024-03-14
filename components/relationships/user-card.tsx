'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';
import { BiSolidCategory } from 'react-icons/bi';
import { LiaSmsSolid } from 'react-icons/lia';
import { MdOutlineHouseSiding } from 'react-icons/md';

interface UserType {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  cities: string[];
  categories: string[];
  hashtags: string[];
  country: string;
}

interface UserCardProps {
  user: UserType;
  follow: boolean;
}

export default function UserCard({ user, follow }: UserCardProps) {
  return (
    <div className='flex gap-4 border-b py-4'>
      <Avatar className='size-16'>
        <AvatarImage src={user.avatar} alt={user.username} />
        <AvatarFallback>{getInitials(user.username || '')}</AvatarFallback>
      </Avatar>
      <div>
        <Link href='/profiles/[username]' as={`/profiles/${user.username}`}>
          {user.username}
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
      <div className='flex gap-2'>
        <Button variant='outline' className='rounded-full' size='icon'>
          <LiaSmsSolid className='size-4' />
        </Button>
        <Button variant='outline' size='sm' className='rounded-full'>
          {follow ? 'Unfollow' : 'Follow'}
        </Button>
      </div>
    </div>
  );
}
