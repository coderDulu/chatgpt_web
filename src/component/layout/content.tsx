import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom';
import Answer from '../content/Answer';
import Question from '../content/Question';
import { useData } from '../hooks/useData';
import '@/css/content.less';
import AutoScroll from 'du-autoscroll';
import 'du-autoscroll/lib/dist/index.css'
import localStorage from '@/utils/storage/localStorage';
import { addCopyToPre } from '../hooks/useMarkDown';
import useDebounce from '../hooks/useDebounce';
import { parseJSON } from '@/utils/json';

export default function content() {
  const { state, wsClient, dispatch } = useData();
  const { sendData, status } = state;
  const { receiveData } = wsClient;
  const receiveRef = useRef('');

  const saveSendData = useDebounce((data) => {
    localStorage.set('sendData', data);
  }, 500);

  useEffect(() => {
    if (status === "end") {
      receiveRef.current = "";
      setTimeout(() => {
        addCopyToPre()
      }, 1000);
    }
  }, [status])

  useEffect(() => {
    const { type, value } = parseJSON(receiveData) ?? {};

    switch (type) {
      case "answer": {
        if (sendData.length) {
          const len = sendData.length - 1;
          receiveRef.current += value;
          sendData[len].receive = receiveRef.current;

          dispatch({
            type: "set",
            payload: {
              sendData: [...sendData]
            }
          })
        }
        if (status === "end") {
          dispatch({ type: "set", payload: { status: "run" } })
        }
        break;
      }
      case "status": {
        if (value === "end") {
          dispatch({ type: "set", payload: { status: "end" } })
        }
        break;
      }
    }
  }, [receiveData])

  useEffect(() => {
    saveSendData(...sendData);
  }, [sendData])


  return (
    <AutoScroll className='l-content'>
      {
        sendData.length ? <SessionItem data={sendData} /> : <h2 className='l-c-tip'>ChatGPT</h2>
      }
    </AutoScroll>
  )
}

function SessionItem({ data }: { data: { send: string; receive: string }[] }) {
  return (
    <>
      {
        data.map((item, key) => {
          return <div key={key} className='c-container'>
            <Question id={key} text={item.send} />
            {/* <Answer text={item.receive.replace(/^\s*$(?:\r\n?|\n)/gm, '')} /> */}
            <Answer text={item.receive} />
          </div>
        })
      }
    </>

  )
}



