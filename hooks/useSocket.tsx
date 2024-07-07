import { useEffect, useState } from 'react';

const useSocket = (locale: string): WebSocket | null => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [socketMessage, setSocketMessage] = useState<any>(null); // Добавляем состояние для сообщений

  useEffect(() => {
    const wsProtocol = 'wss:';
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

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSocketMessage(data);
      } catch (error) {
        console.error('Failed to parse message', error);
      }
    };

    const pingIntervalId = setInterval(() => {
      if (newSocket.readyState === WebSocket.OPEN) {
        const pingData = JSON.stringify({
          messageType: 'ping',
          data: [],
        });
        newSocket.send(pingData);
      }
    }, 50000);

    setSocket(newSocket);

    return () => {
      clearInterval(pingIntervalId);
      newSocket.close();
    };
  }, [locale]);

  return socket;
};

export default useSocket;
