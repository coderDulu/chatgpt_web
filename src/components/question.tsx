import React, { useContext, useState } from 'react'
import '@/css/question.css';
import { Avatar } from 'antd';
import { Context } from '@/pages/main';
import { DeleteOutlined } from '@ant-design/icons';
import IconBtn from './iconBtn';

export default function question({
  text,
  id
}: {
  text: string;
  id: number;
}) {
  const [showDeleteIcon, setShowIcon] = useState(false);
  const { dispatch } = useContext(Context);

  function onConfirm() {
    dispatch({
      type: "del",
      payload: {
        id
      }
    })
  }

  return (
    <div className='question-container' onMouseEnter={e => setShowIcon(true)} onMouseLeave={e => requestAnimationFrame(() => setShowIcon(false))}>
      {/* <div className="question-icon"></div> */}
      <Avatar className='question-icon' shape="square" size="large">ME</Avatar>
      <div className="question-content">
        {
          text
        }
        {
          showDeleteIcon && <IconBtn className="question-del" title='是否删除当前内容' onConfirm={onConfirm}>
            <DeleteOutlined />
          </IconBtn>
        }
      </div>
    </div>
  )
}
