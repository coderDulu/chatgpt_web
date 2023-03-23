import React, { useEffect, useRef, useState } from 'react'
import { Button, Drawer, Input, InputRef, message, Select } from 'antd'
import { HistoryOutlined, SendOutlined } from '@ant-design/icons';
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

  function handleSend() {
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

  return (
    <div className='l-footer'>
      <Button className='l-footer-history' icon={<HistoryOutlined />} onClick={() => setShowDrawer(true)}></Button>
      <Input value={value} ref={inputRef} onChange={(e) => setValue(e.target.value)} placeholder='请输入' onPressEnter={handleSend} />
      {/* <Select
      className='l-footer-history'
        // showSearch
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChange}
        onSearch={onSearch}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        options={[
          {
            value: 'jack',
            label: 'Jack',
          },
          {
            value: 'lucy',
            label: 'Lucy',
          },
          {
            value: 'tom',
            label: 'Tom',
          },
        ]}
      /> */}
      <Drawer title="历史记录" placement="left" onClose={() => setShowDrawer(false)} open={showDrawer}>
        {
          sendData.map((item, index) => <HistoryItem key={index} text={item.send}/>)
        }
      </Drawer>

      <SendOutlined className='l-footer-icon' onClick={handleSend} />
    </div>
  )
}

function HistoryItem({
  text
}: {
  text: string
}) {


  return (
    <div className='l-footer-listItem'>
      <span>{text}</span>
      <SendOutlined className='l-footer-history-icon'/>
    </div>
  )
}
