import React from 'react';
import { BreakoutRoomUser } from '@/helpers/proto/plugnmeet_breakout_room_pb';
import { useTranslations } from 'next-intl';

interface IBreakoutRoomUsersProps {
  users: Array<BreakoutRoomUser>;
}
const BreakoutRoomUsers = ({ users }: IBreakoutRoomUsersProps) => {
  const t = useTranslations('meet');

  return (
    <div className=''>
      {users.map((user) => {
        return (
          <p
            className='mr-2 inline-block border-r border-solid border-black pr-2 leading-4 last:mr-0 last:border-none last:pr-0'
            key={user.id}
          >
            {user.name} (
            {user.joined
              ? t('breakout-room.user-joined')
              : t('breakout-room.not-joined')}
            )
          </p>
        );
      })}
    </div>
  );
};

export default BreakoutRoomUsers;
