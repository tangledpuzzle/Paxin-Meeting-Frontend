import { useEffect, useState } from 'react';

const useSocket = (locale: string) => {
  const [socketMessage, setSocketMessage] = useState<any>(null);

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

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSocketMessage(data); // Сохраняем полученное сообщение в состояние
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

    return () => {
      clearInterval(pingIntervalId);
      newSocket.close();
    };
  }, [locale]);

  return socketMessage; // Возвращаем только текущее сообщение
};

export default useSocket;
