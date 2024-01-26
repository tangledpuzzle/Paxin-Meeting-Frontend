'use client';

import { SessionProvider, SessionProviderProps } from 'next-auth/react';
import { PaxContext } from '@/context/context';
import i18n from '@/i18n';
import axios from 'axios';
import { setCookie } from 'nookies';
import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

interface IProps {
  children: ReactNode;
  session: SessionProviderProps['session'];
}

const Providers: React.FC<IProps> = ({ children, session }) => {
  const [status, setStatus] = useState<string>('');
  const [postMode, setPostMode] = useState<string>('all');
  const [currentPlan, setCurrentPlan] = useState<string>('BASIC');
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [locale, setLocale] = useState<string>(
    typeof window !== 'undefined'
      ? window.localStorage.getItem('locale') || 'en'
      : 'en'
  );

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
          status,
          setStatus,
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
