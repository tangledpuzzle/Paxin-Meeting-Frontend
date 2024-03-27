import { useEffect, useRef, useState } from 'react';

const useOnlineSocket = (): { [key: string]: any } => {
  const socket = useRef<WebSocket>();
  const [onlineState, setOnlineState] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const wsProtocol = 'wss:';
    socket.current = new WebSocket(
      `${wsProtocol}//${process.env.NEXT_PUBLIC_SOCKET_URL}/socket.io/`
    );

    const pingIntervalId = setInterval(() => {
      if (socket.current?.readyState === WebSocket.OPEN) {
        const pingData = JSON.stringify({
          messageType: 'ping',
          data: [],
        });
        socket.current?.send(pingData);
      }
    }, 50000);

    const onMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.command === 'userOffline' || data.command === 'userOnline') {
          setOnlineState((prevState) => {
            return {
              ...prevState,
              online: data.command === 'userOnline',
              username: data.userID,
              lastOnline: data.additional.replace(' ', 'T') + 'Z',
            };
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    socket.current.onmessage = onMessage;

    return () => {
      clearInterval(pingIntervalId);
      socket.current?.removeEventListener('message', onMessage);
      socket.current?.close();
    };
  }, []);

  return { onlineState };
};

export default useOnlineSocket;
