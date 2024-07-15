'use client';

import { PaxContext } from '@/context/context';
import { useContext, useEffect, useState } from 'react';
import { IoIosNotifications } from "react-icons/io";
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import eventBus from '@/lib/eventBus';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Notification({ authenticated }: { authenticated: boolean; }) {

  const { user } = useContext(PaxContext);

  const { data, error, mutate } = useSWR('/api/notifications/get', fetcher);

  useEffect(() => {
    const handleNotificationRead = () => {
      mutate();
    };

    eventBus.on('notificationRead', handleNotificationRead);
    
    return () => {
      eventBus.off('notificationRead', handleNotificationRead);
    };
  }, [mutate]);

  if (!data) return null;

  const unreadCount = data?.data?.unread;

  return authenticated || user ? (
    <Link href="/profile/notifications">
      <button>
        <div className='flex items-center justify-center'>
          {unreadCount > 0 && (
            <span className='relative -top-2 left-10 rounded-full bg-card-gradient-menu px-2 text-center text-xs'>
              {unreadCount}
            </span>
          )}
          <IoIosNotifications size={32} />
        </div>
      </button>
    </Link>
  ) : (
    <></>
  );
}
