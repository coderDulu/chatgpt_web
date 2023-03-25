import React, { useEffect, useRef, useState } from 'react'
import { Button, Drawer, Input, InputRef, message, Select, Tooltip } from 'antd'
import { ClearOutlined, CompassOutlined, HistoryOutlined, LoadingOutlined, RedoOutlined, SendOutlined } from '@ant-design/icons';
import { useData } from '../hooks/useData';
import '@/css/footer.less';
import DrawerList from '../common/drawer';
import { stringifyJSON } from '@/utils/json';

export default function Footer() {
  const inputRef = useRef<InputRef>(null);
  const [value, setValue] = useState('');
  const { state: { sendData, status }, wsClient, dispatch } = useData();
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
  }, [])

  function handleSend(value: string) {
    if (!value) {
      message.warning("请输入内容");
      return;
    }
    sendData.push({ send: value, receive: '' });
    dispatch({ type: "set", payload: { sendData: [...sendData] } }); // 同步

    sendDataToServer(sendData); // 下发

    // 清空状态
    setValue('');
    inputRef.current?.focus();
    showDrawer && setShowDrawer(false); // 隐藏
  }

  /**
   * // 下发消息到服务器
   * @param data 
   */
  function sendDataToServer(data: any[]) {
    let sendData: {
      role: string,
      content: string
    }[] = [];

    const newData = data.slice(-3);

    newData.forEach((item: { send: string; receive: string; }) => {
      const me = item.send;
      me && sendData.push({ role: "user", content: me })
      const ai = item.receive?.replace(/[\n|\s]/g, '') ?? '';
      const aiLen = ai.length;
      ai && sendData.push({ role: "assistant", content: aiLen >= 300 ? ai.slice(-500) : ai })
    })

    wsClient.send(JSON.stringify({ text: sendData }));
  }

  // 重发
  function resend() {
    sendData[sendData.length - 1].receive = ''
    dispatch({
      type: "set",
      payload: {
        sendData
      }
    })
    sendDataToServer(sendData);
  }
  // 清空
  function clearSend() {
    dispatch({
      type: "set",
      payload: {
        sendData: []
      }
    })
  }

  // 停止接收消息
  function stopReceiveData() {
    const data = {
      type: "status",
      value: "stop"
    }
    const stringifyData = stringifyJSON(data)
    stringifyData && wsClient.send(stringifyData);

    dispatch({ type: "set", payload: { status: "end" } })
  }

  return (
    <div className='l-footer'>
      {/* 工具栏 */}
      <div className='l-footer-utils'>
        <CallList send={handleSend} />
        <HistoryList resend={resend} list={sendData} />

        <Tooltip title="重发">
          <Button icon={<RedoOutlined />} onClick={resend} />
        </Tooltip>
        <Tooltip title="清空消息">
          <Button icon={<ClearOutlined />} onClick={clearSend} />
        </Tooltip>
      </div>
      {/* 输入框 */}
      <Input
        value={value}
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        placeholder='请输入'
        onPressEnter={e => handleSend(value)}
        suffix={status === "end" ? <SendOutlined className='l-footer-icon' onClick={() => handleSend(value)} /> : <LoadingOutlined className='l-footer-icon' onClick={stopReceiveData} />} />
    </div>
  )
}

// 历史记录组件
function HistoryList({
  list,
  resend
}: {
  list: any[];
  resend: (text: string) => void;
}) {
  function handleResend(item: any) {
    resend(item.send);
  }

  return <DrawerList tooltip='历史记录' icon={<HistoryOutlined />} list={list} showVal="send" handleResend={handleResend} />
}

// 快捷菜单组件
function CallList({
  send
}: { send: (value: string) => void }) {
  const list = [
    {
      title: "获取图片",
      // value: `从现在起, 当你想发送一张照片时，请使用 Markdown ,并且 不要有反斜线, 不要用代码块。使用 Unsplash API ![Image](https://source.unsplash.com/${window.screen.width / 2}x${window.screen.height / 2}/? < PUT YOUR QUERY HERE >)。如果你明白了，请回复“明白”。`,
      value: `现在起，当我想要你发送照片，图片时，用3/8Markdown 写，不要有反斜线，不要用代码块。使用 Unsplash API(![]https://source.unsplash.com/${(window.screen.width / 3).toFixed(0)}x${(window.screen.height / 3).toFixed(0)}< PUT YOUR QUERY HERE >)。如果听懂了请回复明白，以后都需要这样。`,
      description: ""
    },
    {
      title: "代码格式更正",
      value: "你的回答里代码格式不正确",
    }
  ]

  function handleResend(item: any) {
    // console.log(item.value);
    send(item.value);
  }

  return <>
    <DrawerList tooltip='快捷指令' icon={<CompassOutlined />} list={list} handleResend={handleResend} showVal="title" />
  </>
}

