import { Layout } from 'antd'
import React from 'react'
import '@/css/layout.less';
import SiderMenu from '@/component/layout/menu';
import Content from '@/component/layout/content';
import Footer from '@/component/layout/footer';
import { useData, Provider } from '@/component/hooks/useData';

export default function Layouts() {

  return (
    <Provider>
      <div className='l-layout'>
        <SiderMenu />
        <div className='l-main'>
          <Content />
          <Footer />
        </div>
      </div>
    </Provider>
  )
}
