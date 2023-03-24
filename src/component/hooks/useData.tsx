import React, { ReactNode, useContext, useReducer } from 'react'
import useWebSocket from './useWebsocket';
import localStorage from '@/utils/storage/localStorage';

interface StateProps {
  sendData: SendProps[];
  lastSend: string;
  lastReceive: string;
}

interface SendProps {
  send: string;
  receive: string;
}

interface ContextProps {
  state: StateProps;
  dispatch: React.Dispatch<any>;
  wsClient: {
    socket: WebSocket | null;
    isConnected: boolean;
    send: (data: string) => void;
    reconnect: () => void;
    receiveData: string;
  }
}

interface ActionProps {
  type: string;
  payload: any
}

// 初始化数据
const initState: StateProps = {
  // sendData: [{send: "你好".repeat(1), receive: '你好，有什么可以帮助的吗？'.repeat(100)}, ],
  sendData: localStorage.get('sendData') ?? [],
  lastSend: '',
  lastReceive: ''
}
// 创建reducer
const reducer = (state: StateProps, action: ActionProps) => {
  switch (action.type) {
    case "set":
      return {
        ...state,
        ...action.payload
      }
    case "del":
      state.sendData.splice(action.payload.id, 1);
      return {
        ...state
      }
    default:
      return state
  }
}
// 创建Context
const Context = React.createContext<ContextProps>({
  state: initState,
  dispatch: () => { },
  wsClient: { socket: null, isConnected: false, send: (data) => { }, reconnect: () => { }, receiveData: '' }
});



// 创建 Provider
export const Provider: React.FC<{ children: any }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initState);
  // 创建ws连接
  const wsClient = useWebSocket(`ws://${location.host}/socket`);

  return (
    <Context.Provider value={{ state, dispatch, wsClient }}>
      {children}
    </Context.Provider>
  );
};
// 创建useContext获取数据
export const useData = () => useContext(Context);
