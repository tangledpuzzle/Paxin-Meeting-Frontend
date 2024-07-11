'use client';

import { PaxContext, User, AdditionalData } from '@/context/context';
import axios from 'axios';
import { useLocale } from 'next-intl';
import { setCookie } from 'nookies';
import React, { ReactNode, useEffect, useState } from 'react';
import useSWR from 'swr';
import cookies from 'next-cookies';
import { GetServerSideProps } from 'next';

interface IProps {
  children: ReactNode;
  initialAccessToken: string | null;
}

const PLAN = {
  Начальный: 'BASIC',
  Бизнесс: 'BUSINESS',
  Расширенный: 'ADVANCED',
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Providers: React.FC<IProps> = ({ children, initialAccessToken }) => {
  const [user, setUser] = useState<User | null>(null);
  const [postMode, setPostMode] = useState<string>('all');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [additionalData, setAdditionalData] = useState<AdditionalData[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('BASIC');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const locale = useLocale();
  const [userFetchURL, setUserFetchURL] = useState<string>(
    `/api/users/me?language=${locale}`
  );

  const {
    data: fetchedData,
    error,
    mutate: userMutate,
  } = useSWR(initialAccessToken ? userFetchURL : null, fetcher);

  useEffect(() => {
    setUserFetchURL(`/api/users/me?language=${locale}`);
  }, [locale]);

  useEffect(() => {
    if (!error && fetchedData) {
      setUser({
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
      });

      setCurrentPlan(PLAN[fetchedData.data.user.Plan as keyof typeof PLAN]);
    }
  }, [fetchedData, error]);

  const connectWebSocket = () => {
    if (typeof window !== 'undefined') {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'wss:';
      const _socket = new WebSocket(
        `${wsProtocol}//${process.env.NEXT_PUBLIC_SOCKET_URL}/socket.io/`
      );

      _socket.onopen = () => {};

      _socket.onmessage = (received) => {
        console.log('Socket message: ', received.data);
        try {
          const data = JSON.parse(received.data);

          if (data?.command) {
            setLastCommand(data?.command);
          }

          if (data?.command === 'newDonat' && data?.data) {
            setAdditionalData(data.data);
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

      _socket.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connectWebSocket, 5000); // Attempt to reconnect every 5 seconds
      };

      setSocket(_socket);
    }
  };

  useEffect(() => {
    connectWebSocket();
    return () => {
      socket?.close();
    };
  }, []);

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
        additionalData,
        setAdditionalData,
      }}
    >
      {children}
    </PaxContext.Provider>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { access_token } = cookies(context);

  return {
    props: {
      initialAccessToken: access_token || null,
    },
  };
};

export default Providers;
