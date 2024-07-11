import React from 'react';
import Image from 'next/image';
import { IParticipant } from '@/store/slices/interfaces/participant';
import { ICurrentUser } from '@/store/slices/interfaces/session';

interface IAvatarProps {
  participant?: IParticipant;
  from: ICurrentUser;
}

const Avatar = ({ participant, from }: IAvatarProps) => {
  const render = () => {
    if (participant?.metadata?.profile_pic) {
      return (
        <Image 
          src={participant?.metadata.profile_pic} 
          alt={participant.name} 
          layout="fill"
          objectFit="cover"
        />
      );
    } else {
      let name = from.name;
      if (participant?.name) {
        name = participant?.name;
      }
      return <>{name?.slice(0, 2).toUpperCase()}</>;
    }
  };

  return (
    <div className='avatar flex size-8 items-center justify-center overflow-hidden rounded-full bg-primaryColor text-white shadow-header'>
      {render()}
    </div>
  );
};

export default Avatar;
