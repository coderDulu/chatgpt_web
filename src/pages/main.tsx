import React, { useCallback, useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import '@/css/main.css';
import Question from '@/components/question';
import Answer from '@/components/answer';
import InputContainer from '@/components/input';
import WsClient from '@/utils/websocket';
import localStorage from '@/utils/storage/localStorage';
import AutoScroll from 'du-autoscroll';
import { message } from 'antd';

interface dataType {
  question: string;
  answer: string;
}

interface stateType {
  text: string;   // 问题
  result: string;
  data: dataType[];
  status: 'ending' | 'stopping' | 'running'; // 三个状态：ending running stopping
}

const initState: stateType = {
  text: '',
  result: '',
  data: localStorage.get('state_data') || [],
  status: 'ending'
}

function throttle(func, delay) {
  let timerId;
  return function (...args) {
    if (!timerId) {
      timerId = setTimeout(() => {
        func.apply(this, args);
        timerId = null;
      }, delay);
    }
  };
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function reducer(state: stateType, action: any) {
  switch (action.type) {
    case "set":
      return {
        ...state,
        ...action.payload
      }
    case "del": {
      const id = action.payload.id;
      state.data.splice(id, 1);
      return {
        ...state,
        data: [...state.data]
      };
    }
    default: {
      return state
    }
  }
}


const ws = new WsClient(`ws://${location.host}/socket/`);


ws.onclose = () => {
  message.error("连接已断开！")
}

ws.onerror = () => {
  message.error("连接错误！")
}

export const Context = React.createContext<any>(initState);

export default function main() {
  const [state, dispatch] = useReducer(reducer, initState);
  const resultRef = useRef('');

  const debounceCallback = useCallback(
    throttle((data: any[]) => {
      // 处理搜索逻辑
      localStorage.set('state_data', data);
    }, 1000),
    []
  );



  function setState(payload: Partial<stateType>) {
    dispatch({
      type: "set",
      payload: {
        ...payload
      }
    })
  }

  useEffect(() => {
    ws.onmessage = e => {
      const { data } = e;

      if (data === "end") {
        setState({ status: 'ending' });
        resultRef.current = '';
        return;
      }

      resultRef.current += data;
      if (data) {
        setState({ result: resultRef.current, status: 'running' })
      }
    }
    return () => {
      ws.close(); // 关闭ws连接
    }
  }, [])
 
  // 清空resultRef.current
  useEffect(() => {
    resultRef.current = ''
  }, [state.data.length])
  
  // 保存data
  useEffect(() => {
    debounceCallback(state.data);
  }, [state.data])
  
  // 设置result
  useEffect(() => {
    const { status, result, data } = state;
    if (status === 'running') {
      const length = data.length - 1 <= 0 ? 0 : data.length - 1;
      const newData = JSON.parse(JSON.stringify(data));

      newData[length] = typeof data[length] === 'object' ? newData[length] : {};
      newData[length].answer = result;
      // 设置
      setState({ data: newData })
    }
  }, [state.result, state.status])
  
  // 设置滚动条自动滚动到底部
  useEffect(() => {
    const scrollEl = document.querySelector('.main')
    const { scrollHeight } = scrollEl;

    scrollHeight && setTimeout(() => {
      scrollEl?.scrollTo({
        top: scrollHeight
      })
    }, 10);
  }, [])


  return (
    <Context.Provider value={{ state, dispatch, ws }}>
      <div className='main-container'>
        <AutoScroll className="main">
          {
            state.data.length ? state.data.map((item: dataType, index: number) => {
              return (
                <div key={index}>
                  <Question id={index} text={item.question}></Question>
                  {
                    <Answer id={index} result={item.answer}></Answer>
                  }
                </div>
              )
            }) : <div className='main-tip'>在输入框中输入内容开始聊天 ψ(｀∇´)ψ</div>
          }
          {/* {
            Array(20).fill(0).map((item, index) => <div style={{height: 200}}>{index}</div>)
          } */}
        </AutoScroll>
      </div>
      <InputContainer></InputContainer>
    </Context.Provider>
  )
}
