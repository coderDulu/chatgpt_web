import { SendOutlined } from '@ant-design/icons';
import { Button, Drawer, Tooltip } from 'antd'
import React, { useState } from 'react'

interface PropsType {
  list: any[];
  handleResend: (item: any) => void;
  showVal: string;
  icon: any;
  tooltip: string;
}

export default function DrawerList({
  list,
  handleResend,
  showVal,
  icon,
  tooltip
}: PropsType) {
  const [showCallList, setShow] = useState(false);

  function resend(item: any) {
    handleResend(item);
    setShow(false);
  }

  return (
    <>
      <Tooltip title={tooltip}>
        <Button className='l-utils-btn' icon={icon} onClick={() => setShow(true)} />
      </Tooltip>
      <Drawer title={tooltip} className='l-footer-drawer' placement="left" onClose={() => setShow(false)} open={showCallList}>
        <div className='l-footer-h-list'>
          {
            list.map((item, key) => <DrawerItem key={key} text={item[showVal]} handleResend={() => resend(item)} />)
          }
        </div>
      </Drawer>
    </>
  )
}


// 历史记录组件
function DrawerItem({
  text,
  handleResend
}: {
  text: string;
  handleResend: (text: string) => void;
}) {
  return (
    <div className='l-footer-listItem'>
      <span>{text}</span>
      <Tooltip title="发送">
        <SendOutlined className='l-footer-listItem-icon' onClick={() => handleResend(text)} />
      </Tooltip>
    </div>
  )
}