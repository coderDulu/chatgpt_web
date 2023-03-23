import React from 'react'
import "@/css/content.less";

export default function Question({
  text
}: { text: string }) {
  return (
    <div className='c-send'>
      <div className="c-send-context">
        <div className="c-send-icon">ME</div>
        <div className="c-send-text">{text}</div>
      </div>
    </div>
  )
}
