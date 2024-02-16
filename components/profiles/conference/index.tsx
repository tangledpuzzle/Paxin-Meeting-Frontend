'use client';

/**
 * Edited by Ken
 * To-Do
 *
 * 1. Refactor Timer Separate it from this component
 * 2. API calling move it to the backend. It's vulnerable.
 *
 *
 *
 */
import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HiUserGroup } from 'react-icons/hi';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MeetCreateModal } from '@/components/profiles/conference/meet-create-modal';
import { MeetJoinModal } from '@/components/profiles/conference/meet-join-modal';
import CTASection from '@/components/profiles/cta';
import { useTranslations } from 'next-intl';
import CryptoJS from 'crypto-js';
import { generateRandomString, hashTimestamp } from '@/lib/utils';
import { setAccessToken } from '@/helpers/utils';
import Timer from './Timer';
import toast from 'react-hot-toast';
// Custom formatting for date and time

interface IConferenceProps {
  email: string;
  userId: string;
  name: string;
}

type MODE = 'join' | 'create';
const sendRequest = async (body, method) => {
  const b = JSON.stringify(body);
  const hash = CryptoJS.HmacSHA256(
    b,
    process.env.NEXT_PUBLIC_PAXMEET_API_SECRET || ''
  );
  const signature = CryptoJS.enc.Hex.stringify(hash);

  let headers = {
    'Content-Type': 'application/json',
    'API-KEY': process.env.NEXT_PUBLIC_PAXMEET_API_KEY,
    'HASH-SIGNATURE': signature,
  };

  const response = await fetch(
    process.env.NEXT_PUBLIC_PAXMEET_SERVER_URL + '/auth/' + method,
    {
      method: 'POST',
      headers: headers,
      body: b,
    }
  );

  if (response.status !== 200) {
    console.log(response.json());
    return;
  }

  return await response.json();
};

const processRequest = async (mode: MODE, roomInfo: any, userInfo: any) => {
  let flag = false;

  if (mode === 'create') {
    let isRoomActive = false;
    const res = await sendRequest(
      {
        room_id: roomInfo.room_id,
      },
      'room/isRoomActive'
    );
    isRoomActive = res.status;
    if (isRoomActive) {
      toast.error('A room with the same ID already exists!');
    } else {
      const roomCreateRes = await sendRequest(roomInfo, 'room/create');
      isRoomActive = roomCreateRes.status;
      if (isRoomActive) {
        flag = true;
      }
    }
  } else if (mode === 'join') {
    let isRoomActive = false;
    const res = await sendRequest(
      {
        room_id: roomInfo.room_id,
      },
      'room/isRoomActive'
    );
    isRoomActive = res.status;
    if (!isRoomActive) {
      toast.error('There is no room with that ID!');
    } else {
      flag = true;
    }
  }

  if (flag) {
    const getJoinTokenReq = {
      room_id: roomInfo.room_id,
      user_info: userInfo,
    };

    const roomCreateRes = await sendRequest(
      getJoinTokenReq,
      'room/getJoinToken'
    );

    if (roomCreateRes.status) {
      console.log('[Conf] Token = ' + roomCreateRes.token);
      return roomCreateRes.token;
    } else {
      console.log(roomCreateRes.msg);
      toast.error("Can't get token");
    }
  }
};
export default function Conference({ email, userId, name }: IConferenceProps) {
  const router = useRouter();
  const t = useTranslations('main');
  console.log('render Conference');
  const [isLoading, setLoading] = useState<boolean>(false);

  async function onCreateRoom(feed: string) {
    setLoading(true);
    const roomId = createRoomId(feed);

    console.log('[Conf] Check availability ' + roomId);
    const roomInfo = {
      // room_id: data.get('room_id'),
      room_id: roomId,
      creator: userId,
      empty_timeout: 60 * 60 * 2,
      metadata: {
        room_title: 'Pax Real-Time Meeting',
        welcome_message:
          'Welcome to PaxMeet!<br /> To share microphone click mic icon from bottom left side.',
        //webhook_url: "http://example.com",
        //logout_url: "http://example.com",
        room_features: {
          allow_webcams: true,
          mute_on_start: false,
          allow_screen_share: true,
          allow_rtmp: true,
          admin_only_webcams: false,
          allow_view_other_webcams: true,
          allow_view_other_users_list: true,
          allow_polls: true,
          room_duration: 0,
          enable_analytics: true,
          recording_features: {
            is_allow: true,
            is_allow_cloud: true,
            is_allow_local: true,
            enable_auto_cloud_recording: false,
            only_record_admin_webcams: false,
          },
          chat_features: {
            allow_chat: true,
            allow_file_upload: true,
            max_file_size: 50,
            allowed_file_types: ['jpg', 'png', 'zip'],
          },
          shared_note_pad_features: {
            allowed_shared_note_pad: true,
          },
          whiteboard_features: {
            allowed_whiteboard: true,
          },
          external_media_player_features: {
            allowed_external_media_player: true,
          },
          waiting_room_features: {
            is_active: true,
          },
          breakout_room_features: {
            is_allow: true,
            allowed_number_rooms: 6,
          },
          display_external_link_features: {
            is_allow: true,
          },
          ingress_features: {
            is_allow: true,
          },
          speech_to_text_translation_features: {
            is_allow: true,
            is_allow_translation: true,
          },
          // end_to_end_encryption_features: {
          //     is_enabled: true
          // }
        },
        // default_lock_settings: {
        //     lock_microphone: true,
        //     lock_screen_sharing: true,
        //     lock_webcam: true,
        //     lock_chat_file_share: true,
        //     lock_chat_send_message: true
        // }
      },
    };

    const userInfo = {
      is_admin: false,
      name: name,
      user_id: userId,
      /*user_metadata: {
            record_webcam: false,
        }*/
    };

    const token = await processRequest('create', roomInfo, userInfo);
    setLoading(false);
    if (token) {
      setAccessToken(token);

      router.push(`/meet/?id=${roomId}`);
    }
  }
  function createRoomId(feed: string): string {
    const randomPart = generateRandomString(4);
    const timestampHash = hashTimestamp(Date.now());
    const roomId = `${feed}-${randomPart}-${timestampHash}`;
    return roomId;
  }
  async function onJoinRoom(roomId: string) {
    setLoading(true);
    const roomInfo = {
      // room_id: data.get('room_id'),
      room_id: roomId,
      creator: userId,
      empty_timeout: 60 * 60 * 2,
      metadata: {
        room_title: 'Pax Real-Time Meeting',
        welcome_message:
          'Welcome to PaxMeet!<br /> To share microphone click mic icon from bottom left side.',
        //webhook_url: "http://example.com",
        //logout_url: "http://example.com",
        room_features: {
          allow_webcams: true,
          mute_on_start: false,
          allow_screen_share: true,
          allow_rtmp: true,
          admin_only_webcams: false,
          allow_view_other_webcams: true,
          allow_view_other_users_list: true,
          allow_polls: true,
          room_duration: 0,
          enable_analytics: true,
          recording_features: {
            is_allow: true,
            is_allow_cloud: true,
            is_allow_local: true,
            enable_auto_cloud_recording: false,
            only_record_admin_webcams: false,
          },
          chat_features: {
            allow_chat: true,
            allow_file_upload: true,
            max_file_size: 50,
            allowed_file_types: ['jpg', 'png', 'zip'],
          },
          shared_note_pad_features: {
            allowed_shared_note_pad: true,
          },
          whiteboard_features: {
            allowed_whiteboard: true,
          },
          external_media_player_features: {
            allowed_external_media_player: true,
          },
          waiting_room_features: {
            is_active: true,
          },
          breakout_room_features: {
            is_allow: true,
            allowed_number_rooms: 6,
          },
          display_external_link_features: {
            is_allow: true,
          },
          ingress_features: {
            is_allow: true,
          },
          speech_to_text_translation_features: {
            is_allow: true,
            is_allow_translation: true,
          },
          // end_to_end_encryption_features: {
          //     is_enabled: true
          // }
        },
        // default_lock_settings: {
        //     lock_microphone: true,
        //     lock_screen_sharing: true,
        //     lock_webcam: true,
        //     lock_chat_file_share: true,
        //     lock_chat_send_message: true
        // }
      },
    };

    const userInfo = {
      is_admin: false,
      name: name,
      user_id: userId,
      /*user_metadata: {
            record_webcam: false,
        }*/
    };
    const token = await processRequest('join', roomInfo, userInfo);
    setLoading(false);
    if (token) {
      setAccessToken(token);
      router.push(`/meet/?id=${roomId}`);
    }
  }
  // userMutate();
  return (
    <div className='p-4'>
      <CTASection title={t('conference')} description='' icon={HiUserGroup} />
      <Separator className='my-4' />
      <div className='flex h-[calc(100vh_-_15rem)] w-full flex-col rounded-xl bg-background p-4 sm:h-[calc(100vh_-_13rem)]'>
        <div className='flex w-full items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <Image
              src='/logo-black.svg'
              alt='logo'
              width={50}
              height={50}
              className='size-12 dark:hidden'
            />
            <Image
              src='/logo-white.svg'
              alt='logo'
              width={50}
              height={50}
              className='hidden size-12 dark:block'
            />
            <span className='inline-block font-satoshi text-2xl font-bold text-primary sm:hidden lg:inline-block'>
              PaxMeet
            </span>
          </Link>
          <Timer />
        </div>
        <div className='flex size-full flex-col justify-center'>
          <div className='mb-48 mt-auto space-y-4'>
            <div>
              <div className='w-full text-center text-3xl font-semibold'>
                {t('premium')} <span className='text-primary'>PaxMeet</span>{' '}
                {t('video_meeting')}
              </div>
              <div className='w-full text-center text-muted-foreground'>
                {t('paxmeet_description')}
              </div>
            </div>
            <div className='flex w-full justify-center gap-4'>
              <MeetCreateModal isLoading={isLoading} onCreate={onCreateRoom}>
                <Button
                  variant='outline'
                  className='border-primary text-primary'
                >
                  {t('create')}
                </Button>
              </MeetCreateModal>
              <MeetJoinModal
                name={name}
                isLoading={isLoading}
                onJoin={onJoinRoom}
              >
                <Button>{t('join')}</Button>
              </MeetJoinModal>
            </div>
          </div>
          <div className='mt-auto w-full justify-center text-center text-sm text-muted-foreground'>
            {t('no_one_can_join_meeting_unless_invited_or_admitted_by_host')}
          </div>
        </div>
      </div>
    </div>
  );
}
