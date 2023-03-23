import React, { useEffect, useRef, useState } from 'react'
import { Button, Drawer, Input, InputRef, message, Select, Tooltip } from 'antd'
import { ClearOutlined, HistoryOutlined, RedoOutlined, SendOutlined } from '@ant-design/icons';
import { useData } from '../hooks/useData';
import '@/css/footer.less';

export default function Footer() {
  const inputRef = useRef<InputRef>(null);
  const [value, setValue] = useState('');
  const { state: { sendData }, wsClient, dispatch } = useData();
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

  return (
    <div className='l-footer'>
      {/* <div> */}
      <div className='l-footer-utils'>
        <Tooltip title="历史记录">
          <Button className='l-utils-btn' icon={<HistoryOutlined />} onClick={() => setShowDrawer(true)}></Button>
        </Tooltip>
        <Tooltip title="重发">
          <Button icon={<RedoOutlined />} onClick={resend} />
        </Tooltip>
        <Tooltip title="清空消息">
          <Button icon={<ClearOutlined />} onClick={clearSend} />
        </Tooltip>
      </div>
      <Input value={value} ref={inputRef} onChange={(e) => setValue(e.target.value)} placeholder='请输入' onPressEnter={e => handleSend(value)} suffix={<SendOutlined />} />
      {/* </div> */}

      <Drawer title="历史记录" className='l-footer-drawer' placement="left" onClose={() => setShowDrawer(false)} open={showDrawer}>
        <div className='l-footer-h-list'>
          {
            sendData.map((item, index) => <HistoryItem handleResend={handleSend} key={index} text={item.send} />)
          }
        </div>
      </Drawer>
    </div>
  )
}

function HistoryItem({
  text,
  handleResend
}: {
  text: string;
  handleResend: (text: string) => void;
}) {
  const { state: { sendData }, dispatch } = useData();

  // 重发历史消息
  function resendHistory(text: string) {
    
  }


  return (
    <div className='l-footer-listItem'>
      <span>{text}</span>
      <Tooltip title="发送">
        <SendOutlined className='l-footer-listItem-icon' onClick={() => handleResend(text)} />
      </Tooltip>
    </div>
  )
}
