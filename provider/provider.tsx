'use client';

import { PaxContext, User } from '@/context/context';
import axios from 'axios';
import { useSession } from 'next-auth/react';

import { useLocale } from 'next-intl';
import { setCookie } from 'nookies';
import React, { ReactNode, useEffect, useState } from 'react';
import useSWR from 'swr';

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
  const session = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [postMode, setPostMode] = useState<string>('all');
  const [currentPlan, setCurrentPlan] = useState<string>('BASIC');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const locale = useLocale();

  const {
    data: fetchedData,
    error,
    mutate: userMutate,
  } = useSWR(
    session.status === 'authenticated' ? `/api/users/me?lang=${locale}` : null,
    fetcher
  );

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
        onlinehours: fetchedData.data?.user?.total_online_hours[0],
        totalposts: fetchedData.data?.user?.totalblogs,
      });
    }

    setCurrentPlan(PLAN[fetchedData?.data?.user?.Plan as keyof typeof PLAN]);
  }, [fetchedData, error]);

  useEffect(() => {
    if (process.browser) {
      const wsProtocol =
        window.location.protocol === 'https:' ? 'wss:' : 'wss:';
      const _socket = new WebSocket(
        `${wsProtocol}//go.paxintrade.com/socket.io/`
      );

      _socket.onmessage = (received) => {
        console.log('Socket message: ', received.data);
        try {
          const data = JSON.parse(received.data);

          if (data?.session) {
            console.log('Socket message: ', data?.session);
            setCookie(null, 'session', data?.session);
            axios.defaults.headers.common['session'] = data?.session;
          }
        } catch (error) {}
      };

      const intervalId = setInterval(() => {
        if (_socket.readyState === WebSocket.OPEN) {
          _socket.send(
            JSON.stringify({
              messageType: 'ping',
              data: [],
            })
          );
        }
      }, 5000);

      setSocket(_socket);

      return () => {
        clearInterval(intervalId);
        _socket.close();
      };
    }
  }, []);

  return (
    <PaxContext.Provider
      value={{
        user,
        setUser,
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
