import { ClearOutlined } from '@ant-design/icons'
import { Popconfirm } from 'antd'
import React from 'react'
import '@/css/iconbtn.less';

interface propsType {
  children: any;
  onConfirm: any;
  title: string;
  className?: string;
}

export default function iconBtn({
  children,
  onConfirm,
  title,
  className
}: propsType) {
  return (
    <Popconfirm
      title={title}
      onConfirm={onConfirm}
      okText="是"
      cancelText="否"
    >
      <div className={`icon-btn ${className}`}>
        {
          children
        }
      </div>
    </Popconfirm>
  )
}
