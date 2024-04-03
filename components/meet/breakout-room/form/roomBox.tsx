import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';

import UserBox from './userBox';
import { UserType, ItemTypes } from './types';
import { useAppDispatch } from '@/store/hook';
import { updateBreakoutRoomDroppedUser } from '@/store/slices/breakoutRoomSlice';

interface IRoomBoxProps {
  roomId: number;
  name: string;
  users: Array<UserType>;
}

export const RoomBox = ({ roomId, name, users }: IRoomBoxProps) => {
  const dispatch = useAppDispatch();
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.USER,
    drop: (item: any) => {
      dispatch(
        updateBreakoutRoomDroppedUser({
          id: item.id,
          roomId: roomId,
        })
      );
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  useEffect(() => {
    if (dropRef.current) {
      drop(dropRef.current);
    }
  }, [drop]);

  const isActive = canDrop && isOver;
  let backgroundColor = 'bg-white dark:bg-darkPrimary';
  if (isActive) {
    backgroundColor = 'bg-primaryColor';
  } else if (canDrop) {
    backgroundColor = 'bg-secondaryColor';
  }

  return (
    <div
      ref={dropRef}
      className={`roomBox scrollBar scrollBar2 mb-2 h-60 w-full overflow-hidden overflow-y-auto border border-solid border-black dark:border-darkText sm:mb-6 sm:w-[13rem] lg:w-[13.2rem] xl:w-[13.75rem]  ltr:mr-4 lg:ltr:mr-6 rtl:ml-4 lg:rtl:ml-6 ${backgroundColor}`}
    >
      <p
        className={`border-b-2 border-solid  px-2 py-1 text-sm sm:text-base
        ${
          isActive || canDrop
            ? 'border-white text-white'
            : 'border-black text-black dark:border-darkText dark:text-darkText'
        }`}
      >
        {name}
      </p>
      {users.map((user) => {
        return (
          <div key={user.id}>
            <UserBox name={user.name} id={user.id} />
          </div>
        );
      })}
    </div>
  );
};
