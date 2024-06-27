'use client';

import { PaxContext, User } from '@/context/context';
import axios from 'axios';
import { useLocale } from 'next-intl';
import { setCookie } from 'nookies';
import React, { ReactNode, useEffect, useState } from 'react';
import useSWR from 'swr';
import cookie from 'cookie';

interface IProps {
  children: ReactNode;
}

const PLAN = {
  Начальный: 'BASIC',
  Бизнесс: 'BUSINESS',
  Расширенный: 'ADVANCED',
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Providers: React.FC<IProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [postMode, setPostMode] = useState<string>('all');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [currentPlan, setCurrentPlan] = useState<string>('BASIC');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userID, setUserID] = useState<string | null>(null);
  const locale = useLocale();
  const [userFetchURL, setUserFetchURL] = useState<string>(
    `/api/users/me?language=${locale}`
  );

  const { data: fetchedData, error, mutate: userMutate } = useSWR(
    cookie.parse(document.cookie || '').access_token ? userFetchURL : null,
    fetcher
  );

  useEffect(() => {
    setUserFetchURL(`/api/users/me?language=${locale}`);
  }, [locale]);

  useEffect(() => {
    if (!error && fetchedData) {
      const user = {
        id: fetchedData.data?.user?.id,
        username: fetchedData.data?.user?.name,
        email: fetchedData.data?.user?.email,
        avatar: fetchedData.data?.user?.photo,
        plan: fetchedData.data?.user?.Plan,
        city: fetchedData.data?.user?.profile[0].City.map((city: string) =>
          JSON.parse(city)
        ),
        category: fetchedData.data?.user?.profile[0].guilds.map(
          (guild: string) => JSON.parse(guild)
        ),
        hashtags: fetchedData.data?.user?.profile[0].hashtags,
        role: fetchedData.data?.user?.role,
        balance: fetchedData.data?.balance,
        storage: fetchedData.data?.storage,
        limitStorage: fetchedData.data?.user?.limitstorage,
        followers: fetchedData.data?.user?.totalfollowers,
        followings: fetchedData.data?.user?.followings?.length,
        onlinehours: fetchedData.data?.user?.online_hours[0],
        totalposts: fetchedData.data?.user?.totalrestblog,
      };

      setUser(user);
      setUserID(fetchedData.data?.user?.id);
      setCurrentPlan(PLAN[fetchedData.data.user.Plan as keyof typeof PLAN]);
    }
  }, [fetchedData, error]);

  const initializeSocket = (userID: string | null) => {
    // Закрываем предыдущее соединение перед созданием нового
    if (socket) {
      socket.close();
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const _socket = new WebSocket(
      `${wsProtocol}//${process.env.NEXT_PUBLIC_SOCKET_URL}/socket.io/`
    );

    _socket.onmessage = (received) => {
      console.log('Socket message: ', received.data);
      try {
        const data = JSON.parse(received.data);

        if (data?.command) {
          setLastCommand(data?.command);
        }

        if (data?.session) {
          console.log('Socket message: ', data?.session);
          setCookie(null, 'session', data?.session, {
            path: '/',
          });
          axios.defaults.headers.common['session'] = data?.session;
        }
      } catch (error) {
        console.error('Ошибка при обработке сообщения сокета:', error);
      }
    };

    _socket.onopen = () => {
      console.log('Соединение установлено');
      if (userID) {
        _socket.send(JSON.stringify({
          MessageType: 'updateProfile',
          data: [{ userID }]
        }));
      }
    };

    _socket.onclose = (event) => {
      console.log('Соединение закрыто:', event);
      // Попытка переподключения через 5 секунд
      setTimeout(() => {
        initializeSocket(userID);
      }, 5000);
    };

    _socket.onerror = (error) => {
      console.error('Ошибка сокета:', error);
    };

    setSocket(_socket);
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Страница стала видимой, переподключение к WebSocket');
        initializeSocket(userID);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Инициализируем сокет только при первом монтировании
    initializeSocket(userID);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (socket) {
        socket.close();
      }
    };
  }, [userID]);

  return (
    <PaxContext.Provider
      value={{
        user,
        setUser,
        lastCommand,
        userMutate,
        postMode,
        setPostMode,
        currentPlan,
        setCurrentPlan,
        socket,
        setSocket,
      }}
    >
      {children}
    </PaxContext.Provider>
  );
};

export default Providers;
