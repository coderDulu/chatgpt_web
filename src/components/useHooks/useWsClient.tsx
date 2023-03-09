import { debounce } from '@/utils/debounce';
import WsClient from '@/utils/websocket';
import { message } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import useWebSocket from './useWebsocket';



export default function useWsClient(): [WebSocket | null, string, boolean] {
  const { socket, isConnected, reconnect } = useWebSocket(`ws://${location.host}/socket`);
  const [result, setResult] = useState('');
  const timer = useRef<NodeJS.Timer>();
  const delay = 2000;
  const [status, setStatus] = useState(false);  // 是否显示断开连接状态
  const clearRef = useRef(false);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if(!isConnected) {
        reconnect()
      } 
      setStatus(!isConnected)
    }, delay);
  }, [isConnected])

  useEffect(() => {
    if (socket) {
      socket.onmessage = e => {
        // if(clearRef.current) {
        //   setResult('');
        // }
        const { data } = e;
        if (data !== 'end') {
          setResult(lastData => lastData + data);
        } else {
          setResult(data);
          // clearRef.current = true;
          setTimeout(() => {
            setResult('')
          }, 100);
        }
      }
    }
  }, [socket])

  return [socket, result, status]
}
