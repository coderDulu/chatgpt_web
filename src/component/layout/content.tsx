import React, { useEffect, useRef } from 'react'
import Answer from '../content/Answer';
import Question from '../content/Question';
import { useData } from '../hooks/useData';
import '@/css/content.less';
import AutoScroll from 'du-autoscroll';
import 'du-autoscroll/lib/dist/index.css'
import localStorage from '@/utils/storage/localStorage';


export default function content() {
  const { state, wsClient, dispatch } = useData();
  const { sendData } = state;
  const { receiveData } = wsClient;
  const receiveRef = useRef('');

  useEffect(() => {
    if (!/^end$/.test(receiveData) && sendData.length && receiveData) {
      const len = sendData.length - 1;
      receiveRef.current += receiveData;

      sendData[len].receive = receiveRef.current;

      dispatch({
        type: "set",
        payload: {
          sendData: [...sendData]
        }
      })
    } else {
      // localStorage.set('sendData', sendData);
    }
  }, [receiveData])


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
            <Question text={item.send} />
            <Answer text={item.receive.trimStart()} />
          </div>
        })
      }
    </>

  )
}



