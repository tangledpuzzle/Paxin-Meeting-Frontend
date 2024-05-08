import { cn } from '@/lib/utils';
import { useChat } from '@livekit/components-react';
import { useCallback, useMemo, useState, type KeyboardEvent } from 'react';
import { Button } from './ui/button';
import { Icons } from './ui/icons';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarImage } from '../ui/avatar';
import { t } from '@excalidraw/excalidraw/types/i18n';
import { useTranslations } from 'next-intl';

interface Props {
  participantName: string;
}

export default function Chat({ participantName }: Props) {
  const t = useTranslations('main');

  const { chatMessages: messages, send } = useChat();

  const reverseMessages = useMemo(
    () => messages.sort((a, b) => b.timestamp - a.timestamp),
    [messages]
  );

  const [message, setMessage] = useState('');

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (message.trim().length > 0 && send) {
          send(message).catch((err) => console.error(err));
          setMessage('');
        }
      }
    },
    [message, send]
  );

  const onSend = useCallback(() => {
    if (message.trim().length > 0 && send) {
      send(message).catch((err) => console.error(err));
      setMessage('');
    }
  }, [message, send]);
  console.log(reverseMessages);

  return (
    <>
      <div className='flex min-h-0 flex-1 flex-col-reverse overflow-y-auto'>
        {reverseMessages.map((message) => (
          <div key={message.timestamp} className='flex items-center gap-2 p-2'>
            <Avatar className='mr-3 size-10'>
              <AvatarImage
                src={`https://proxy.paxintrade.com/100/https://img.paxintrade.com/${message.from?.metadata}`}
              />
            </Avatar>
            <div className='flex flex-col'>
              <div className='flex items-center gap-2'>
                <div
                  className={cn(
                    'text-xs font-semibold',
                    participantName === message.from?.identity &&
                      'text-indigo-500'
                  )}
                >
                  {message.from?.name}
                  {participantName === message.from?.identity && ' (you)'}
                </div>
                <div className='text-xs text-gray-500'>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
              <div className='text-sm'>{message.message}</div>
            </div>
          </div>
        ))}
      </div>
      <div className='flex w-full gap-2'>
        <Textarea
          value={message}
          className='border-box h-10 bg-white dark:bg-zinc-900'
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          onKeyDown={onEnter}
          placeholder={t('type_message')}
        />
        <Button disabled={message.trim().length === 0} onClick={onSend}>
          <div className='flex items-center gap-2'>
            <Icons.send className='h-4 w-4' />
          </div>
        </Button>
      </div>
    </>
  );
}
