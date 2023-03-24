import React, { useEffect, useRef, useState } from 'react'
import "@/css/content.less";
import { DeleteOutlined } from '@ant-design/icons';
import { useData } from '../hooks/useData';
import { Tooltip } from 'antd';

export default function Question({
  text,
  id
}: { text: string; id: number }) {
  const [showDel, setShowDel] = useState(false);
  const { dispatch } = useData();

  function delOneOfData() {
    dispatch({
      type: "del",
      payload: {
        id
      }
    })
  }

  return (
    <div className='c-send' onMouseEnter={() => setShowDel(true)} onMouseLeave={() => setShowDel(false)}>
      <div className="c-send-context">
        <div className="c-send-icon">ME</div>
        <div className="c-send-text">{text}</div>
        {
          showDel ? <div className="c-send-clear">
            <Tooltip title="删除当前消息">
              <DeleteOutlined onClick={delOneOfData} />
            </Tooltip>
          </div> : null
        }
      </div>
    </div>
  )
}
