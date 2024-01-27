'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { PaxContext, User } from '@/context/context';
import i18n from '@/i18n';
import { setCookie } from 'nookies';
import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import axios from 'axios';
import useSWR from 'swr';

interface IProps {
  children: ReactNode;
  session: SessionProviderProps['session'];
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const Providers: React.FC<IProps> = ({ children, session }) => {
  const [user, setUser] = useState<User | null>(null);
  const [postMode, setPostMode] = useState<string>('all');
  const [currentPlan, setCurrentPlan] = useState<string>('BASIC');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [locale, setLocale] = useState<string>(
    typeof window !== 'undefined'
      ? window.localStorage.getItem('locale') || 'en'
      : 'en'
  );

  const { data: fetchedData, error } = useSWR(
    `/api/users/me?lang=${locale}`,
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

    console.log(fetchedData);
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
    <SessionProvider session={session}>
      <PaxContext.Provider
        value={{
          user,
          setUser,
          postMode,
          setPostMode,
          currentPlan,
          setCurrentPlan,
          socket,
          setSocket,
          locale,
          setLocale,
        }}
      >
        <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      </PaxContext.Provider>
    </SessionProvider>
  );
};

export default Providers;
