"use client";
import { useEffect, useState } from 'react';
import { IoIosNotifications } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import Link from 'next/link';
import useSWR from 'swr';
import eventBus from '@/lib/eventBus';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '@/components/ui/dialog';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Notification {
  ID: number;
  title: string;
  message: string;
  url: string;
  user_id: string;
  created_at: string;
  read: boolean;
}

interface ApiResponse {
  data: {
    data: Notification[];
    meta: {
      limit: number;
      skip: number;
      total: number;
    };
  };
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

const pageSize = 10;

export default function Notifications() {
  const { data, error, mutate } = useSWR<ApiResponse>('/api/notifications/get', fetcher);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [markedAsRead, setMarkedAsRead] = useState<Set<number>>(new Set());
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.data.data) {
      setNotifications(data.data.data);
      setSkip(data.data.data.length);
      setHasMore(data.data.data.length < data.data.meta.total);
      setLoading(false);
    }
  }, [data]);

  const loadMoreNotifications = async () => {
    const res = await fetcher(`/api/notifications/get?skip=${skip}&limit=${pageSize}`);
    setNotifications((prev) => [...prev, ...res.data.data]);
    setSkip((prev) => prev + res.data.data.length);
    setHasMore(skip + res.data.data.length < res.data.meta.total);
  };

  useEffect(() => {
    const handleNotificationRead = (notificationID: number) => {
      setMarkedAsRead((prevSet) => new Set(prevSet).add(notificationID));
      mutate(); // Обновить данные после изменения состояния
    };

    eventBus.on('notificationRead', handleNotificationRead);

    return () => {
      eventBus.off('notificationRead', handleNotificationRead);
    };
  }, [mutate]);

  const markAsRead = (notificationID: number) => {
    if (markedAsRead.has(notificationID)) return;

    fetch(`/api/notifications/${notificationID}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ read: true }),
    })
      .then((response) => {
        if (response.ok) {
          eventBus.emit('notificationRead', notificationID);
        } else {
          console.error('Failed to mark notification as read');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const deleteNotification = (notificationID: number) => {
    fetch(`/api/notifications/${notificationID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          setNotifications((prev) => prev.filter((n) => n.ID !== notificationID));
          toast.success('Уведомление удалено успешно');
          mutate(); // Обновить данные после удаления уведомления
        } else {
          console.error('Failed to delete notification');
          toast.error('Не удалось удалить уведомление');
        }
        setNotificationToDelete(null);
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Не удалось удалить уведомление');
      });
  };

  if (loading) return <SkeletonLoader />;

  if (!notifications.length && !loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Уведомления</h1>
        <p className="text-left">Уведомления не найдены</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Уведомления</h1>
      <InfiniteScroll
        dataLength={notifications.length}
        next={loadMoreNotifications}
        hasMore={hasMore}
        loader={<SkeletonLoader />}
        endMessage={
          <p className="text-center py-4">
            <b>Все уведомления загружены</b>
          </p>
        }
      >
        <ul className="space-y-4">
          {notifications.map(notification => (
            <li key={notification.ID}
              className={`p-4 rounded-lg shadow-md flex items-center ${notification.read ? 'bg-white dark:bg-black' : 'bg-blue-100 dark:bg-blue-500'}`}
              onMouseOver={() => !notification.read && markAsRead(notification.ID)}
              onTouchStart={() => !notification.read && markAsRead(notification.ID)}
            >
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold">{notification.title}</h2>
                <p className="text-gray-700 dark:text-white">{notification.message}</p>
                <Link href={notification.url} rel="noopener noreferrer"
                  className={`py-4 rounded-lg flex justify-between items-center ${notification.read ? 'text-blue-500 dark:text-blue-500' : 'text-gray-700 dark:text-white'}`}
                  passHref>
                  Открыть
                </Link>
                <div className='flex gap-4 items-center'>
                  <p className="text-sm text-gray-700 dark:text-white mt-2">{new Date(notification.created_at).toLocaleString()}</p>
                  <button
                    onClick={() => setNotificationToDelete(notification)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <MdDelete size={24} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </InfiniteScroll>

      <Dialog open={!!notificationToDelete} onOpenChange={() => setNotificationToDelete(null)}>
        <DialogContent>
          <DialogHeader>Подтверждение удаления</DialogHeader>
          <p>Вы уверены, что хотите удалить это уведомление?</p>
          <DialogFooter>
            <button
              onClick={() => deleteNotification(notificationToDelete?.ID!)}
              className="text-red-500 hover:text-red-700"
            >
              Удалить
            </button>
            <button
              onClick={() => setNotificationToDelete(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Отмена
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const SkeletonLoader = () => {
  return (
    <div className="container mx-auto px-0 py-8">
      {/* <h1 className="text-2xl font-bold mb-4">Уведомления</h1> */}
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="p-4 bg-white dark:bg-black rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
