import React from 'react';
import { IParticipant } from '@/store/slices/interfaces/participant';
import Image from 'next/image';

interface IAvatarProps {
  participant: IParticipant;
}
const Avatar = ({ participant }: IAvatarProps) => {
  const render = () => {
    if (participant.metadata.profile_pic) {
      return (
        <Image
          src={participant.metadata.profile_pic}
          alt={participant.name}
          layout='fill'
          objectFit='cover'
        />
      );
    } else {
      return <>{participant.name.slice(0, 2).toUpperCase()}</>;
    }
  };
  return (
    <div className='thumb flex size-[22px] items-center justify-center overflow-hidden rounded-full bg-primaryColor text-xs text-white xl:size-[30px] xl:text-sm ltr:mr-2 rtl:ml-2'>
      {render()}
    </div>
  );
};

export default Avatar;
