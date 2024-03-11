import { useEffect, useState } from 'react';

const useSocket = (locale: string): WebSocket | null => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const wsProtocol = 'ws:';
    const wsPath = process.env.NEXT_PUBLIC_SOCKET_URL!;
    const newSocket = new WebSocket(
      `${wsProtocol}//${wsPath}/stream/live?langue=` + locale
    );

    newSocket.onopen = () => {
      const message = {
        messageType: 'getADS',
        locale: locale,
      };
      newSocket.send(JSON.stringify(message));
    };

    newSocket.onmessage = (event) => {};

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [locale]);

  return socket;
};

export default useSocket;
