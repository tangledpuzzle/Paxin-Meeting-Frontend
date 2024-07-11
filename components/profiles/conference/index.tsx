'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { setAccessToken } from '@/helpers/utils';
import { createRoom, createRoomId, joinRoom } from '@/helpers/api/paxMeetAPI';
import { RTCContext } from '@/provider/webRTCProvider';
import { isValidLatinAndNumber } from '@/lib/utils';
import useSelector from '@/hooks/useSelector';
import Meet from './meet';

interface IConferenceProps {
  email: string;
  userId: string;
  name: string;
}

export default function Conference({ userId, name }: IConferenceProps) {
  const router = useRouter();
  const t = useTranslations('main');

  const [isLoading, setLoading] = useState<boolean>(false);
  const clearSession = useSelector(RTCContext, (state) => state.clearSession);
  //@ts-expect-error: no sms
  const translate = useCallback((e: string) => t(e), [t]);
  //   function clearSession() {}

  const onCreateRoom = useCallback(
    async (feed: string) => {
      feed = feed.trim();
      if (feed === '') {
        toast.error(t('roomid_required'));
        return;
      } else if (!isValidLatinAndNumber(feed)) {
        toast.error(t('use_latin_letters_and_numbers_only'));
        return;
      }

      setLoading(true);

      const roomId = createRoomId(feed);
      const token = await createRoom(roomId, userId, name);
      setLoading(false);

      if (token) {
        console.log('NEW TOKEN: ', token);
        await clearSession();
        toast.success('Новая комната создана.');
        setAccessToken(token);
        router.push(`/meet/${roomId}`);
      }
    },
    [setLoading, clearSession, name, t, router, userId]
  );

  const onJoinRoom = useCallback(
    async (roomId: string) => {
      roomId = roomId.trim();
      if (roomId === '') {
        toast.error(t('roomid_required'));
        return;
      } else if (!isValidLatinAndNumber(roomId)) {
        toast.error(t('use_latin_letters_and_numbers_only'));
        return;
      }

      setLoading(true);
      const token = await joinRoom(roomId, userId, name);
      setLoading(false);

      if (token) {
        await clearSession();
        setAccessToken(token);
        router.push(`/meet/${roomId}`);
      }
    },
    [setLoading, clearSession, name, router, t, userId]
  );

  return (
    <Meet
      t={translate}
      isLoading={isLoading}
      name={name}
      onCreateRoom={onCreateRoom}
      onJoinRoom={onJoinRoom}
    />
  );
}
