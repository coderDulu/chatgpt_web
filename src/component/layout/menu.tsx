import React, { useEffect, useState } from 'react';
import { MessageOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Drawer, MenuProps } from 'antd';
import { Menu } from 'antd';
import '@/css/menu.less';
import addResize from '@/utils/addResizeListener';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('Chat', 'sub1', <MessageOutlined />, [
    getItem('gpt-3.5-turbo', '1'),
  ]),
];

const SiderMenu: React.FC = () => {
  const [showDrawer, setShowDrawer] = useState(false)


  // useEffect(() => {
  //   addResize.add('resize', () => {

  //   })

  //   return () => {
  //     addResize.remove('resize');
  //   }
  // }, [])

  return (
    <div className='l-menu'>
      <div className='l-menu-navbar'>
        <UnorderedListOutlined className='l-menu-navbar-list' onClick={() => setShowDrawer(true)} />
        <div className='l-menu-navbar-title'>ChatGPT</div>
      </div>

      <List />

      <Drawer
        placement='left'
        closable={false}
        open={showDrawer}
        key='left'
        maskClosable={true}
        onClose={() => setShowDrawer(false)}
        className='l-drawer'
        bodyStyle={{ width: '100%', padding: 0 }}
      >
        <ListMenu />
      </Drawer>
    </div>
  );
};

function List() {
  const [show, setShow] = useState(window.innerWidth > 768);

  useEffect(() => {
    addResize.add('resize', () => {
      if (window.innerWidth < 768) {
        setShow(false)
      } else {
        setShow(true)
      }
    })

    return () => {
      addResize.remove('resize');
    }
  }, [])

  return (
    <>
      {
        show && <div className='menu-list'>
          {/* <Button icon={<UnorderedListOutlined />} className="menu-list-icon" onClick={() => setCollapsed(!collapsed) } /> */}
          <ListMenu />
        </div>
      }
    </>
  )
}

function ListMenu() {
  const [current, setCurrent] = useState('1');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };
  return (
    <Menu
      theme='dark'
      onClick={onClick}
      defaultOpenKeys={['sub1']}
      selectedKeys={[current]}
      mode="inline"
      items={items}
      className='l-menu-list'
    />
  )
}

export default SiderMenu;