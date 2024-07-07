import { useEffect, useState } from 'react';

import { sendWebsocketMessage } from '../websocket';
import {
  DataMessage,
  DataMsgBodyType,
  DataMsgType,
} from '../proto/plugnmeet_datamessage_pb';
import { useTranslations } from 'next-intl';
import { useAppStore } from '@/store/hook';

const useWatchVisibilityChange = () => {
  const store = useAppStore();
  const t = useTranslations('meet');
  const [hidden, setHidden] = useState<boolean>(false);

  useEffect(() => {
    const onBlur = () => {
      setHidden(true);
    };
    const onFocus = () => {
      setHidden(false);
    };

    window.addEventListener('blur', onBlur, false);
    window.addEventListener('focus', onFocus, false);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  // in mobile sometime above solution doesn't work properly
  useEffect(() => {
    let hidden: string | undefined, visibilityChange: string;
    if (typeof document.hidden !== 'undefined') {
      // Opera 12.10 and Firefox 18 and later support
      hidden = 'hidden';
      visibilityChange = 'visibilitychange';
    } else if (typeof (document as any).msHidden !== 'undefined') {
      hidden = 'msHidden';
      visibilityChange = 'msvisibilitychange';
    } else if (typeof (document as any).webkitHidden !== 'undefined') {
      hidden = 'webkitHidden';
      visibilityChange = 'webkitvisibilitychange';
    }

    const handleVisibilityChange = () => {
      //@ts-expect-error: no sms
      if (document[hidden]) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    };

    if (
      typeof document.addEventListener !== 'undefined' ||
      hidden !== undefined
    ) {
      document.addEventListener(
        // @ts-expect-error: no sms
        visibilityChange,
        handleVisibilityChange,
        false
      );
    }
    return () => {
      if (
        typeof document.addEventListener !== 'undefined' ||
        hidden !== undefined
      ) {
        document.removeEventListener(visibilityChange, handleVisibilityChange);
      }
    };
  }, []);

  useEffect(() => {
    const session = store.getState().session;
    const dataMsg = new DataMessage({
      type: DataMsgType.SYSTEM,
      roomSid: session.currentRoom.sid,
      roomId: session.currentRoom.room_id,
      body: {
        type: DataMsgBodyType.USER_VISIBILITY_CHANGE,
        from: {
          sid: session.currentUser?.sid ?? '',
          userId: session.currentUser?.userId ?? '',
        },
        msg: hidden ? 'hidden' : 'visible',
      },
    });

    sendWebsocketMessage(dataMsg.toBinary(), t);
  }, [hidden]);
};

export default useWatchVisibilityChange;
