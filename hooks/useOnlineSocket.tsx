import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { usePaxContext } from '@/context/context';

const useOnlineSocket = (): { [key: string]: any } => {
  const { socket } = usePaxContext();
  const { data: session } = useSession();
  const [onlineState, setOnlineState] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (socket) {
      const pingIntervalId = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          const pingData = JSON.stringify({
            messageType: 'ping',
            data: [],
          });
          socket.send(pingData);
        }
      }, 50000);

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
        clearInterval(pingIntervalId);
        socket.removeEventListener('message', onMessage);
      };
    }
  }, [socket]);

  const pingUserIsTyping = (roomID: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
      const pingData = JSON.stringify({
        messageType: 'UserIsTyping',
        data: [
          {
            roomID,
            access_token: session?.accessToken || '',
          },
        ],
      });

      socket.send(pingData);
    }
  };

  return { onlineState, pingUserIsTyping };
};

export default useOnlineSocket;
