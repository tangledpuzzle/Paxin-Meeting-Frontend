import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePaxContext } from '@/context/context';
import cookie from 'cookie';

const useOnlineSocket = (): { [key: string]: any } => {
  const { socket } = usePaxContext();
  const { data: session } = useSession();
  const [onlineState, setOnlineState] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (socket) {
      const onMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);

          if (data.command === 'userOffline' || data.command === 'userOnline') {
            setOnlineState((prevState) => ({
              ...prevState,
              online: data.command === 'userOnline',
              username: data.userID,
              lastOnline: data.additional.replace(' ', 'T') + 'Z',
            }));
          }
        } catch (error) {
          console.log(error);
        }
      };

      socket.addEventListener('message', onMessage);

      return () => {
        socket.removeEventListener('message', onMessage);
      };
    }
  }, [socket]);

  const getAccessToken = (): string | null => {
    let accessToken: string | null = session?.accessToken as string | null;
    if (!accessToken) {
      if (typeof window !== 'undefined') {
        const parsedCookies = cookie.parse(document.cookie);
        accessToken = parsedCookies.access_token || null;
      }
    }
    return accessToken;
  };

  const pingUserIsTyping = (roomID: string) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error('Unauthorized');
      return;
    }

    if (socket?.readyState === WebSocket.OPEN) {
      const pingData = JSON.stringify({
        messageType: 'UserIsTyping',
        data: [
          {
            roomID,
            access_token: accessToken!,
          },
        ],
      });

      socket.send(pingData);
    }
  };

  return { onlineState, pingUserIsTyping };
};

export default useOnlineSocket;
