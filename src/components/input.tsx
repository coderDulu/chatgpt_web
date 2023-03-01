import React, { useContext, useEffect, useRef, useState } from 'react'
import { Input, InputRef, Popconfirm, Spin, Tooltip } from 'antd';
import { ClearOutlined, LoadingOutlined, RedoOutlined, SendOutlined, StopOutlined } from '@ant-design/icons';
import '@/css/input.less';
import { Context } from '@/pages/main'
import IconBtn from './iconBtn';

export default function input() {
  const { dispatch, ws, state } = useContext(Context);
  const [value, setValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  const { data, status } = state;


  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  useEffect(() => {
    if (status === 'ending') {
      inputRef.current?.focus();
    }
  }, [status])
  // 发送
  function sendMsg() {

    data.push({ question: value });

    dispatch({
      type: "set",
      payload: {
        text: value,
        data
      }
    })
    let sendData = '';
    
    const newData = data.slice(-3);

    newData.forEach((item: { question: string; answer: string; }) => {
      const me = item.question;
      me && (sendData += `ME:${me} `);
      const ai = item.answer;
      ai && (sendData += `${ai} `);
    })
    
    ws.request({ text: sendData });

    setValue('')
  }
  // 清空
  function clearData() {
    dispatch({
      type: "set",
      payload: {
        data: []
      }
    });
    localStorage.clear();
  }
  // 停止
  function stopReceiveData() {
    // 设置status为stopping;
    dispatch({
      type: "set",
      payload: {
        status: 'stopping'
      }
    })
    // 告诉服务器销毁当前问答
    ws.request({
      type: "stop"
    })
  }
  // 重发
  function restartRequest() {
    if (status === 'ending' && data.length) {
      data[data.length - 1].answer = '';
      dispatch({
        type: "set",
        payload: {
          data: [...data]
        }
      })
    }

    let sendData: string = '';

    data.forEach((item: { question: any; answer: any; }, index: number) => {
      const me = item.question;
      me && (sendData += `ME:${me} `);
      const ai = item.answer;
      (index !== data.length - 1) && ai && (sendData += `${ai} `);
    })

    ws.request({
      text: sendData
    })
  }
  return (
    <div className='chat-input'>
      <div className="chat-utils-clear">
        <IconBtn title='是否清空全部消息' onConfirm={clearData}>
          <ClearOutlined />
        </IconBtn>
      </div>
      <Input
        ref={inputRef}
        className='chat-input-content'
        value={value}
        onChange={e => setValue(e.target.value)}
        onPressEnter={sendMsg}
        placeholder="输入你的内容"
        disabled={status === 'running'}
        suffix={<SendOutlined onClick={sendMsg} />}>
      </Input>
      <div className="chat-utils-stop">
        {
          status === 'running' ? <IconBtn title='终止接收？' onConfirm={stopReceiveData}>
            <LoadingOutlined spin />
          </IconBtn> : <IconBtn title='重新请求？' onConfirm={restartRequest}>
            <RedoOutlined />
          </IconBtn>
        }

      </div>
    </div>
  )
}
