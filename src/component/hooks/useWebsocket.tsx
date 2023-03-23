import { useState, useEffect, useRef } from 'react';

const useWebSocket = (url: string, reconnectTimes: number = 10) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectCount = useRef(0);
  const [receiveData, setReceiveData] = useState('');

  useEffect(() => {
    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      setIsConnected(true);
    };

    newSocket.onclose = () => {
      setIsConnected(false);
    };

    newSocket.onmessage = (event) => {
      // console.log('receive -> ', event.data);
      setReceiveData(event.data);
    }

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [url]);

  const send = (data: string) => {
    if (isConnected) {
      socket?.send(data);
    }
  };

  const reconnect = () => {
    if (!isConnected && reconnectCount.current < reconnectTimes) {
      const newSocket = new WebSocket(url);

      newSocket.onopen = () => {
        setIsConnected(true);
        reconnectCount.current = 0;
      };

      newSocket.onclose = () => {
        setIsConnected(false);
        setTimeout(reconnect, 1000);
        reconnectCount.current += 1;
      };

      setSocket(newSocket);
    }
  };

  return { socket, isConnected, send, reconnect, receiveData };
};

export default useWebSocket;