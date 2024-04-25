import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './types';

export interface IUserBoxProps {
  name: string;
  id: string;
}

const UserBox = ({ name, id }: IUserBoxProps) => {
  const dragRef = useRef<HTMLDivElement>(null); // Create a ref using useRef

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.USER,
    item: { name, id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  drag(dragRef.current); // Pass the ref to the drag function

  const opacity = isDragging ? 0.4 : 1;
  return (
    <div
      ref={dragRef} // Assign the ref object to the ref prop
      style={{ opacity }}
      className='userBox w-full cursor-move border-b border-solid border-black/80 bg-white px-2 py-1 text-sm text-black dark:border-darkText/90 dark:bg-darkSecondary2 dark:text-darkText sm:text-base'
    >
      {name}
    </div>
  );
};

export default UserBox;
