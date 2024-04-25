import React from 'react';

interface IParticipantNameProps {
  name: string;
  isCurrentUser: boolean;
}
const ParticipantName = ({ name, isCurrentUser }: IParticipantNameProps) => {
  return (
    <p className='primaryColor text-[11px] dark:text-darkText xl:text-[13px]'>
      {name} {isCurrentUser ? ' (me)' : null}
    </p>
  );
};

export default ParticipantName;
