import React, { useCallback, useContext, useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import '@/css/main.less';
import Question from '@/components/question';
import Answer from '@/components/answer';
import InputContainer from '@/components/input';
import localStorage from '@/utils/storage/localStorage';
import AutoScroll from 'du-autoscroll';
import { message, Spin } from 'antd';
import useWsClient from '@/components/useHooks/useWsClient';

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

function throttle(func: any, delay: number) {
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

function debounce(func: any, delay: number) {
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


export const Context = React.createContext<any>(initState);

export default function main() {
  const [state, dispatch] = useReducer(reducer, initState);
  const [wsClient, result, connectStatus] = useWsClient();
  const delayRef = useRef(0);

  // 防抖保存data
  const debounceCallback = useCallback(
    debounce((data: any[]) => {
      // 处理搜索逻辑
      localStorage.set('state_data', data);
    }, 1000),
    []
  );

  // 节流显示markdown
  const throttleToData = useCallback(throttle((data: any[]) => {
    setState({ data });
  }, delayRef.current), [delayRef.current])

  function setState(payload: Partial<stateType>) {
    dispatch({
      type: "set",
      payload: {
        ...payload
      }
    })
  }


  // 处理接受的result
  useEffect(() => {
    if (result === "end") {
      setState({ status: 'ending' });
      return;
    }

    if (result) {
      state.status !== 'running' && setState({ status: 'running' })
      setLastData(result);
    }

  }, [result])

  // 保存data
  useEffect(() => {
    debounceCallback(state.data);
  }, [state.data])

  // 设置result
  function setLastData(result: string) {
    const { data } = state;

    const length = data.length - 1 <= 0 ? 0 : data.length - 1;
    const newData = JSON.parse(JSON.stringify(data));

    newData[length] = typeof data[length] === 'object' ? newData[length] : {};
    newData[length].answer = result;

    // 设置
    const matchLength = result.match(/```/g)?.length;
    if (matchLength) {
      if (matchLength % 2 === 0) {
        setState({ data: newData });
      } else {
        // delayRef.current = 1000
        // throttleToData(newData)
        newData[length].answer = result + "加载中...";
        setState({data: newData})
      }
    } else {
      setState({ data: newData });
    }

  }

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
    <Context.Provider value={{ state, dispatch, ws: wsClient }}>
      {
        connectStatus && <div className='main-span'>
          <Spin spinning tip={<span className='main-span-tip'>"连接已断开重连中..."</span>} size="large" ></Spin>
        </div>
      }
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
