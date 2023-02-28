import React, { useContext, useEffect, useRef, useState } from 'react'
import { Input, InputRef, Popconfirm, Tooltip } from 'antd';
import { ClearOutlined, SendOutlined } from '@ant-design/icons';
import '@/css/input.css';
import { Context } from '@/pages/main'
import IconBtn from './iconBtn';

export default function input() {
  const { dispatch, ws, state } = useContext(Context);
  const [value, setValue] = useState('');
  const inputRef = useRef<InputRef>(null);

  const { data, isSending } = state;

  useEffect(() => {
    if (!isSending) {
      inputRef.current?.focus();
    }
  }, [isSending])

  function sendMsg() {

    data.push({ question: value });

    dispatch({
      type: "set",
      payload: {
        // data: state.data.push({
        //   question: value
        // })
        text: value,
        data
      }
    })

    ws.request({ text: value });

    setValue('')
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  function clearData() {
    dispatch({
      type: "set",
      payload: {
        data: []
      }
    });
    localStorage.clear();
  }

  return (
    <div className='chat-input'>
      <div className="chat-utils">
        <IconBtn title='是否清空全部消息' onConfirm={clearData}>
          <ClearOutlined className='chat-utils-clear' />
        </IconBtn>
      </div>
      <Input
        ref={inputRef}
        className='chat-input-content'
        value={value}
        onChange={e => setValue(e.target.value)}
        onPressEnter={sendMsg}
        placeholder="输入你的内容"
        disabled={isSending}
        suffix={<SendOutlined onClick={sendMsg} />}></Input>

    </div>
  )
}
