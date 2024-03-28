'use client';

import getConnectionToken from '@/lib/server/chat/getConnectionToken';
import getSubscriptionToken from '@/lib/server/chat/getSubscriptionToken';
import {
  Centrifuge,
  PublicationContext,
  SubscribedContext,
  Subscription,
  SubscriptionState,
  SubscriptionStateContext,
} from 'centrifuge';
import { useEffect, useRef, useState } from 'react';

function useCentrifuge(
  userId: string | null | undefined,
  onPublication: (data: any) => void | null
) {
  const [unrecoverableError, setUnrecoverableError] = useState('');
  const [realTimeStatus, setRealTimeStatus] = useState('🔴');
  const centrifuge = useRef<Centrifuge | null>(null);
  const sub = useRef<Subscription | null>(null);

  useEffect(() => {
    if (!userId) return;

    const personalChannel = `personal:${userId}`;

    const getPersonalChannelSubscriptionToken = async () => {
      return getSubscriptionToken(personalChannel);
    };

    centrifuge.current = new Centrifuge(
      `wss://${process.env.NEXT_PUBLIC_SOCKET_URL}/connection/websocket` || '',
      {
        getToken: getConnectionToken,
        debug: true,
      }
    );

    console.log('new Centrifuge');

    sub.current = centrifuge.current.newSubscription(personalChannel, {
      getToken: getPersonalChannelSubscriptionToken,
    });

    sub.current.on('publication', (ctx: PublicationContext) => {
      onPublication && onPublication(ctx.data);
    });

    sub.current.on('subscribed', (ctx: SubscribedContext) => {
      if (ctx.wasRecovering && !ctx.recovered) {
        setUnrecoverableError('State LOST - please reload the page');
      }
    });

    sub.current.on('state', (ctx: SubscriptionStateContext) => {
      if (ctx.newState == SubscriptionState.Subscribed) {
        setRealTimeStatus('🟢');
      } else {
        setRealTimeStatus('🔴');
      }
    });

    sub.current.subscribe();
    centrifuge.current.connect();

    return () => {
      console.log('disconnect Centrifuge');
      centrifuge.current && centrifuge.current.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (sub.current) {
      sub.current.removeAllListeners();

      sub.current.on('publication', (ctx: PublicationContext) => {
        onPublication(ctx.data);
      });

      sub.current.on('subscribed', (ctx: SubscribedContext) => {
        if (ctx.wasRecovering && !ctx.recovered) {
          setUnrecoverableError('State LOST - please reload the page');
        }
      });

      sub.current.on('state', (ctx: SubscriptionStateContext) => {
        if (ctx.newState == SubscriptionState.Subscribed) {
          setRealTimeStatus('🟢');
        } else {
          setRealTimeStatus('🔴');
        }
      });
    }
  }, [onPublication]);

  return { centrifuge, sub };
}

export default useCentrifuge;
