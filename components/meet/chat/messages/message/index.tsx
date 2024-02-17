import React from 'react';

import { IChatMsg } from '@/store/slices/interfaces/dataMessages';
import { ICurrentUser } from '@/store/slices/interfaces/session';
import { useAppSelector } from '@/store';

import Avatar from './avatar';
import { participantsSelector } from '@/store/slices/participantSlice';
import { useTranslations } from 'next-intl';

interface IMessageProps {
  body: IChatMsg;
  currentUser?: ICurrentUser;
}
const Message = ({ body, currentUser }: IMessageProps) => {
  const participant = useAppSelector((state) =>
    participantsSelector.selectById(state, body.from.userId)
  );
  const t = useTranslations('meet');

  const render = () => {
    if (body.from.userId === 'system') {
      return (
        <div className='content system mb-2 w-[calc(100%)] pt-2'>
          <p
            className='message-content max-w-fit bg-primaryColor text-xs text-white shadow-footer'
            dangerouslySetInnerHTML={{ __html: body.msg }}
          />
        </div>
      );
    } else if (currentUser?.userId === body.from.userId) {
      return (
        <div className='content me w-[calc(100%-2rem)] pt-2'>
          <p className='name primaryColor pb-1 pl-2 text-sm dark:text-darkText'>
            {t('right-panel.you')}
          </p>
          <p
            className='message-content max-w-fit bg-secondaryColor text-xs text-white shadow-footer'
            dangerouslySetInnerHTML={{ __html: body.msg }}
          />
        </div>
      );
    } else {
      return (
        <>
          <Avatar participant={participant} from={body.from} />
          <div className='content w-[calc(100%-2rem)] pt-2'>
            <p className='name pb-1 pl-2 text-sm dark:text-darkText'>
              {body.from.name ? body.from.name : participant?.name}
              <span style={{ fontSize: '10px' }}>
                {participant ? null : ' (offline)'}
              </span>
            </p>
            <p
              className='message-content max-w-fit bg-white text-xs shadow-footer'
              dangerouslySetInnerHTML={{ __html: body.msg }}
            />
          </div>
        </>
      );
    }
  };

  return <div className='wrapper flex '>{render()}</div>;
};

export default Message;
